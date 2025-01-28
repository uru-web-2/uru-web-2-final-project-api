import express from "express";
import helmet from "helmet";
import bcrypt from "bcrypt";
import Session, {checkSession} from "./session.js";
import Logger from "./logger.js";
import DatabaseManager from "./database.js";
import ErrorHandler from "./handler.js";
import {LOG_IN, SIGN_UP} from "./model.js";
import {SIGN_UP_PROC} from "../database/model/storedProcedures.js";
import {
    USER_EMAILS_UNIQUE_EMAIL,
    USER_USERNAMES_UNIQUE_USERNAME
} from "../database/model/constraints.js";
import {Validate} from "@ralvarezdev/js-joi-parser";
import {PostgresIsUniqueConstraintError} from "@ralvarezdev/js-dbmanager";
import {SALT_ROUNDS} from "./bcrypt.js";
import {ConstraintFailError, HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";

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
        try{
            // Validate the request
            const body = HandleValidation(req, res, (req)=>Validate(req, SIGN_UP));

            // Hash the password
            body.password_hash = bcrypt.hashSync(req.body.password, SALT_ROUNDS)

            // Handle the request
            let userID
            const queryRes = await DatabaseManager.query({
                text: SIGN_UP_PROC,
                values: [body.first_name, body.last_name, body.username, body.email, body.password_hash, null]
            })
            if (queryRes.rows.length > 0)
                userID = queryRes.rows[0]?.out_user_id

            // Log the user ID
            Logger.info(`user signed up with ID: ${userID}`)

            // Send the response
            res.status(200).json(SuccessJSendBody())
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName=PostgresIsUniqueConstraintError(error)

            // Check if the username has already been registered
            if (constraintName===USER_USERNAMES_UNIQUE_USERNAME)
                error = new ConstraintFailError(400,"username", "username has already been registered")
            else if (constraintName===USER_EMAILS_UNIQUE_EMAIL)
                error = new ConstraintFailError(400,"email","email has already been registered")

            // Pass the error to the error handler
            next(error)
        }
    }

    // Handle the login request
    logIn(req, res) {
        // Validate the request
        const body= HandleValidation(req, res, req =>Validate(req.body, LOG_IN));

        // Handle the request
        // ...
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