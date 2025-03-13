import {v4 as uuidv4} from "uuid";
import express from "express";
import helmet from "helmet";
import bcrypt from "bcrypt";
import Session, {sessionExists} from "./session.js";
import Logger from "./logger.js";
import DatabaseManager from "./database.js";
import ErrorHandler from "./handler.js";
import {
    EXECUTE,
    FORGOT_PASSWORD,
    LOG_IN,
    SIGN_UP,
    VERIFY_EMAIL
} from "./model.js";
import {
    CREATE_USER_EMAIL_VERIFICATION_TOKEN_PROC,
    CREATE_USER_PROC,
    GET_USER_EMAIL_INFO_BY_USER_ID_PROC,
    LOG_IN_PROC,
    VERIFY_USER_EMAIL_VERIFICATION_TOKEN_PROC
} from "../database/model/storedProcedures.js";
import {GET_ALL_USER_PROFILES_FN,} from "../database/model/functions.js";
import {
    IDENTITY_DOCUMENTS_UNIQUE_NUMBER,
    PASSPORTS_UNIQUE_NUMBER,
    USER_EMAILS_UNIQUE_EMAIL,
    USER_USERNAMES_UNIQUE_USERNAME
} from "../database/model/constraints.js";
import {Validate} from "@ralvarezdev/js-joi-parser";
import {PostgresIsUniqueConstraintError} from "@ralvarezdev/js-dbmanager";
import {SALT_ROUNDS} from "./bcrypt.js";
import {
    FailJSendBody,
    FieldFailError,
    HandleValidation,
    SuccessJSendBody
} from "@ralvarezdev/js-express";
import Security from "./security.js";
import {
    sendResetPasswordEmail,
    sendVerificationEmail,
    sendWelcomeEmail
} from "./mailersend.js";
import {EMAIL_VERIFICATION_TOKEN_DURATION} from "./constants.js";
import {addDuration} from "./utils.js";

// Validate new password
function ValidateNewPassword(password) {
    // Check if the password is valid
    if (password.length < 10)
        throw new FieldFailError(400,
            "password",
            "password must be at least 10 characters long"
        )

    // Check if the password contains a lowercase letter
    if (!/[a-z]/.test(password))
        throw new FieldFailError(400,
            "password",
            "password must contain a lowercase letter"
        )

    // Check if the password contains an uppercase letter
    if (!/[A-Z]/.test(password))
        throw new FieldFailError(400,
            "password",
            "password must contain an uppercase letter"
        )

    // Check if the password contains a number
    if (!/[0-9]/.test(password))
        throw new FieldFailError(400,
            "password",
            "password must contain a number"
        )

    // Check if the password contains a special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
        throw new FieldFailError(400,
            "password",
            "password must contain a special character"
        )
}

// Validate a new username
function ValidateNewUsername(username) {
    // Check if the username contains whitespaces
    if (username.includes(" "))
        throw new FieldFailError(400,
            "username",
            "username cannot contain spaces"
        )

    // Check if the username contains only alphanumeric characters
    if (!/^[a-zA-Z0-9]*$/.test(username))
        throw new FieldFailError(400,
            "username",
            "username can only contain alphanumeric characters"
        )
}

// Added email verification to session
function AddEmailVerificationToSession(req) {
    Session.set(req, {userID:req.session.userID, profileID:req.session.profileID, isEmailVerified: true})
}

// Set session to the response
function SetSessionToResponse(req, userID, profileID, isEmailVerified) {
    Session.set(req, {
        userID,
        profileID,
        isEmailVerified
    })
}

// Dispatcher for handling requests
export class Dispatcher {
    #app

    // Initialize the dispatcher
    constructor() {
        // Create a new instance of the app
        this.#app = express()

        // Add the body parser middleware
        this.#app.use(express.json())

        // Add the error JSON body parser handler middleware
        this.#app.use(ErrorHandler.errorJSONBodyParserCatcher())

        // Add the url encoded body parser middleware
        this.#app.use(express.urlencoded({extended: true}));

        // Add Helmet middleware for security
        this.#app.use(helmet());

        // Add Express Session middleware
        this.#app.use(Session.session)

        // Set the signup route
        this.#app.post("/signup", this.SignUp)

        // Set the login route
        this.#app.post("/login", this.LogIn)

        // Set the logout route
        this.#app.post("/logout", sessionExists, this.LogOut)

        // Set the execute route
        this.#app.post("/execute", sessionExists, this.Execute)

        // Set the send email verification route
        this.#app.post("/send-email-verification",
            sessionExists,
            this.SendEmailVerification
        )

        // Set the verify email route
        this.#app.post("/verify-email", sessionExists, this.VerifyEmail)

        // Set the forgot password route
        this.#app.post("/forgot-password", this.ForgotPassword)

        // Set the reset password route
        // this.#app.post("/reset-password", sessionExists, this.ResetPassword)

        // Add the error catcher middleware
        this.#app.use(ErrorHandler.errorCatcher())
    }

    // Start the server
    start(port) {
        // Wait for the security components to be ready
        Security.load().then(() => {
            this.#app.listen(port, () => {
                Logger.info(`Server started on port: ${port}`)
            })
        })
    }

    // Handle the signup request
    async SignUp(req, res, next) {
        try {
            // Validate the request
            const body = HandleValidation(req,
                res,
                req => Validate(req, SIGN_UP)
            );

            // Validate the password
            ValidateNewPassword(req.body.password)

            // Validate the username
            ValidateNewUsername(req.body.username)

            // Hash the password
            body.password_hash = bcrypt.hashSync(req.body.password, SALT_ROUNDS)

            // Generate a random token
            const emailVerificationToken = uuidv4()

            // Create the user
            let userID

            const queryRes = await DatabaseManager.rawQuery(CREATE_USER_PROC,
                null,
                body.first_name,
                body.last_name,
                body.username,
                body.email,
                body.password_hash,
                body.document_country,
                body.document_type,
                body.document_number,
                emailVerificationToken,
                addDuration(EMAIL_VERIFICATION_TOKEN_DURATION).toISOString(),
                null,
                null
            )
            if (queryRes.rows.length > 0) {
                const isCountryValid = queryRes.rows[0]?.out_is_country_valid
                userID = queryRes.rows[0]?.out_user_id

                // Check if the country is valid
                if (!isCountryValid)
                    throw new FieldFailError(400,
                        "document_country",
                        "country not found"
                    )
            }

            // Log the user ID
            Logger.info(`Signed up user ${userID}`)

            // Send the response
            res.status(200).json(SuccessJSendBody())

            // Send the welcome and verification emails
            const fullName = body.first_name + " " + body.last_name
            await sendWelcomeEmail(body.email, fullName)

            // Send the verification email
            await sendVerificationEmail(body.email,
                fullName,
                emailVerificationToken
            )
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the username has already been registered
            if (constraintName === USER_USERNAMES_UNIQUE_USERNAME)
                error = new FieldFailError(400,
                    "username",
                    "username has already been registered"
                )

            // Check if the email has already been registered
            else if (constraintName === USER_EMAILS_UNIQUE_EMAIL)
                error = new FieldFailError(400,
                    "email",
                    "email has already been registered"
                )

            // Check if the identity document number or passport number has already been registered
            else if (constraintName === IDENTITY_DOCUMENTS_UNIQUE_NUMBER || constraintName === PASSPORTS_UNIQUE_NUMBER)
                error = new FieldFailError(400,
                    "document_number",
                    "document number has already been registered"
                )

            // Pass the error to the error handler
            next(error)
        }
    }

    // Handle the login request
    async LogIn(req, res, next) {
        try {
            // Check if there's already a session
            if (req.session.userID)
                return res.status(400).json(FailJSendBody({session: "session already exists"}))

            // Validate the request
            const body = HandleValidation(req,
                res,
                req => Validate(req, LOG_IN)
            );

            // Get the user ID and password hash
            let userID, passwordHash
            const logInRes = await DatabaseManager.rawQuery(LOG_IN_PROC,
                body.username,
                null,
                null,
                null,
            )

            // Check if the username was found
            if (logInRes.rows.length > 0) {
                userID = logInRes.rows[0]?.out_user_id
                passwordHash = logInRes.rows[0]?.out_user_password_hash
            }

            // Check if the user exists
            if (!userID)
                throw new FieldFailError(401, "username", "username not found")

            // Check if the password is correct
            if (!bcrypt.compareSync(body.password, passwordHash))
                throw new FieldFailError(401, "password", "incorrect password")

            // Get the user profiles
            const profilesRes = await DatabaseManager.rawQuery(
                GET_ALL_USER_PROFILES_FN,
                userID
            )

            // Parse the user profiles
            const parsedUserProfiles = []
            const parsedUserProfilesNames = []
            for (let i = 0; i < profilesRes.rows.length; i++) {
                parsedUserProfiles.push({
                    name: profilesRes.rows[i]?.name,
                    id: profilesRes.rows[i]?.id
                })
                parsedUserProfilesNames.push(profilesRes.rows[i]?.name)
            }

            // Check if the user has multiple profiles
            if (parsedUserProfilesNames.length > 1 && !body.profile)
                throw new FieldFailError(401,
                    "profile",
                    "multiple profiles found, specify a profile between: " + parsedUserProfilesNames.join(
                        ", ")
                )

            // Check if the user has the specified profile
            if (body.profile && !parsedUserProfilesNames.includes(body.profile))
                throw new FieldFailError(401,
                    "profile",
                    "profile not found, specify a profile between: " + parsedUserProfilesNames.join(
                        ", ")
                )

            // Create a session with the given profile
            SetSessionToResponse(req, userID, body.profile ? parsedUserProfiles.find(profile => profile.name === body.profile).id : parsedUserProfiles[0].id,
                logInRes.rows[0]?.out_user_email_is_verified
            )

            // Log the user ID
            Logger.info(`Logged in user ${userID}`)

            // Send the response
            res.status(201).json(SuccessJSendBody())
        } catch (error) {
            // Pass the error to the error handler
            next(error)
        }
    }

    // Handle the logout request
    LogOut(req, res) {
        // Destroy the session
        Session.destroy(req)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Handle the execute request
    async Execute(req, res, next) {
        try {
            // Validate the request
            const {
                modules,
                object,
                method,
                parameters
            } = HandleValidation(req, res, req => Validate(req, EXECUTE));

            // Substitute the parameters in the request
            delete req.modules
            delete req.object
            delete req.method
            delete req.parameters
            req.body = parameters

            // Handle the request
            await Security.executeMethod(modules, object, method, req, res)
        } catch (error) {
            // Pass the error to the error handler
            next(error)
        }
    }

    // Handle the send email verification request
    async SendEmailVerification(req, res, next) {
        try {
            // Check if the email is already verified
            if (req.session.isEmailVerified)
                throw new FieldFailError(400, "email", "email is already verified")

            // Generate a random token
            const emailVerificationToken = uuidv4()

            // Get the user email information by the user ID
            const getRes = await DatabaseManager.rawQuery(
                GET_USER_EMAIL_INFO_BY_USER_ID_PROC,
                req.session.userID,
                null,
                null,
                null,
                null,
            )
            const firstName = getRes.rows[0]?.out_user_first_name
            const lastName = getRes.rows[0]?.out_user_last_name
            const fullName = firstName + " " + lastName
            const emailID = getRes.rows[0]?.out_user_email_id
            const email = getRes.rows[0]?.out_user_email

            // Create the user with the new email verification token
            const createRes=await DatabaseManager.rawQuery(CREATE_USER_EMAIL_VERIFICATION_TOKEN_PROC,
                emailID,
                emailVerificationToken,
                addDuration(EMAIL_VERIFICATION_TOKEN_DURATION).toISOString(),
                null,
            )
            if (createRes.rows[0].out_user_email_is_verified) {
                // Set in the session that the email is verified
                AddEmailVerificationToSession(req)

                throw new FieldFailError(400,
                    "email",
                    "email is already verified"
                )
            }

            // Send the response
            res.status(200).json(SuccessJSendBody())

            // Send the verification email
            await sendVerificationEmail(email, fullName, emailVerificationToken)
        } catch (error) {
            // Pass the error to the error handler
            next(error)
        }
    }

    // Handle the verify email request
    async VerifyEmail(req, res, next) {
        try {
            // Validate the request
            const body = HandleValidation(req,
                res,
                req => Validate(req, VERIFY_EMAIL)
            );

            // Verify the email
            const queryRes = await DatabaseManager.rawQuery(
                VERIFY_USER_EMAIL_VERIFICATION_TOKEN_PROC,
                body.token,
                null,
            )
            const isTokenValid = queryRes.rows[0]?.out_user_email_verification_token_is_valid
            if (!isTokenValid)
                throw new FieldFailError(400, "token", "token is invalid")

            // Set in the session that the email is verified
            AddEmailVerificationToSession(req)

            // Send the response
            res.status(200).json(SuccessJSendBody())
        } catch (error) {
            // Pass the error to the error handler
            next(error)
        }
    }

    // Handle the forgot password request
    async ForgotPassword(req, res, next) {
        try {
            // Validate the request
            const body = HandleValidation(req,
                res,
                req => Validate(req, FORGOT_PASSWORD)
            );

            // Generate a random token
            const resetPasswordToken = uuidv4()

            // Get the user email information by the user ID
            const queryRes = await DatabaseManager.rawQuery(
                GET_USER_EMAIL_INFO_BY_USER_ID_PROC,
                req.session.userID,
                null,
                null,
                null,
                null,
            )
            const firstName = queryRes.rows[0]?.out_user_first_name
            const lastName = queryRes.rows[0]?.out_user_last_name
            const fullName = firstName + " " + lastName
            const emailID = queryRes.rows[0]?.out_user_email_id
            const email = queryRes.rows[0]?.out_user_email

            // Create the new reset password token
            await DatabaseManager.rawQuery(CREATE_USER_EMAIL_VERIFICATION_TOKEN_PROC,
                emailID,
                resetPasswordToken,
                addDuration(EMAIL_VERIFICATION_TOKEN_DURATION).toISOString(),
            )

            // Send the response
            res.status(200).json(SuccessJSendBody())

            // Send the reset password email
            await sendResetPasswordEmail(email, fullName, resetPasswordToken)
        } catch (error) {
            // Pass the error to the error handler
            next(error)
        }
    }
}

// Singleton instance for the dispatcher
export default new Dispatcher()