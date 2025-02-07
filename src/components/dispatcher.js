import express from "express";
import helmet from "helmet";
import bcrypt from "bcrypt";
import Session, {checkSession} from "./session.js";
import Logger from "./logger.js";
import DatabaseManager from "./database.js";
import ErrorHandler from "./handler.js";
import {LOG_IN, SIGN_UP} from "./model.js";
import {LOG_IN_PROC, SIGN_UP_PROC} from "../database/model/storedProcedures.js";
import {
    GET_USER_PROFILES_FN,
} from "../database/model/functions.js";
import {
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

// Dispatcher for handling requests
export default class Dispatcher {
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
        this.#app.post("/signup", this.signUp)

        // Set the login route
        this.#app.post("/login", this.logIn)

        // Set the logout route
        this.#app.post("/logout", checkSession, this.logOut)

        // Set the execute route
        this.#app.post("/execute", checkSession, this.Execute)

        // Add the error catcher middleware
        this.#app.use(ErrorHandler.errorCatcher())
    }

    // Start the server
    start(port) {
        this.#app.listen(port, () => {
            Logger.info(`Server started on port: ${port}`)
        })
    }

    // Handle the signup request
    async signUp(req, res, next) {
        try {
            // Validate the request
            const body = HandleValidation(req, res, req => Validate(req, SIGN_UP));

            // Hash the password
            body.password_hash = bcrypt.hashSync(req.body.password, SALT_ROUNDS)

            // Create the user
            let userID
            const queryRes = await DatabaseManager.rawQuery(SIGN_UP_PROC, body.first_name, body.last_name, body.username, body.email, body.password_hash, null)
            if (queryRes.rows.length > 0)
                userID = queryRes.rows[0]?.out_user_id

            // Log the user ID
            Logger.info(`User signed up with ID: ${userID}`)

            // Send the response
            res.status(200).json(SuccessJSendBody())
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the username has already been registered
            if (constraintName === USER_USERNAMES_UNIQUE_USERNAME)
                error = new FieldFailError(400, "username", "username has already been registered")
            else if (constraintName === USER_EMAILS_UNIQUE_EMAIL)
                error = new FieldFailError(400, "email", "email has already been registered")

            // Pass the error to the error handler
            next(error)
        }
    }

    // Handle the login request
    async logIn(req, res, next) {
        try {
            // Check if there's already a session
            if (Session.exists(req)) {
                // Send the response
                res.status(400).json(FailJSendBody({session: "session already exists"}))
                return
            }

            // Validate the request
            const body = HandleValidation(req, res, req => Validate(req, LOG_IN));

            // Get the user ID and password hash
            let userID, passwordHash
            const logInRes = await DatabaseManager.rawQuery(LOG_IN_PROC,
                body.username, null, null)
            if (logInRes.rows.length > 0) {
                userID = logInRes.rows[0]?.out_user_id
                passwordHash = logInRes.rows[0]?.out_password_hash
            }

            // Check if the user exists
            if (!userID)
                throw new FieldFailError(401, "username", "username not found")

            // Check if the password is correct
            if (!bcrypt.compareSync(body.password, passwordHash))
                throw new FieldFailError(401, "password", "incorrect password")

            // Get the user profiles
            const userProfiles = await DatabaseManager.rawQuery(GET_USER_PROFILES_FN, userID)

            // Parse the user profiles
            const parsedUserProfiles = []
            for (let i = 0; i < userProfiles.rows.length; i++)
                parsedUserProfiles.push(userProfiles.rows[i]?.name)

            // Check if the user has multiple profiles
            if (parsedUserProfiles.length > 1&&!body.profile)
                throw new FieldFailError(401, "profile", "multiple profiles found, specify a profile between: " + parsedUserProfiles.join(", "))

            // Check if the user has the specified profile
            if (body.profile && !parsedUserProfiles.includes(body.profile))
                throw new FieldFailError(401, "profile", "profile not found, specify a profile between: " + parsedUserProfiles.join(", "))

            // Create a session with the given profile
            Session.set(req, {userID, profile: body.profile?body.profile:parsedUserProfiles[0]})

            // Log the user ID
            Logger.info(`User logged in with ID: ${userID}`)

            // Send the response
            res.status(201).json(SuccessJSendBody())
        } catch (error) {
            // Pass the error to the error handler
            next(error)
        }
    }

    // Handle the logout request
    logOut(req, res) {
        // Destroy the session
        Session.destroy(req)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Handle the execute request
    Execute(req, res) {
        // Handle the request
        // ...
    }
}