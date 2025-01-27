import express from "express";
import helmet from "helmet";
import Session from "./session.js";
import Logger from "./logger.js";
import bcrypt from "bcrypt";
import {ErrorCatcher, HandleValidation} from "./handler.js";
import Validate from "@ralvarezdev/js-joi-parser/parser/validate.js";
import {LOG_IN, SIGN_UP} from "./model.js";
import checkSession from "@ralvarezdev/js-session/express/middlewares.js";
import {successResponse} from "./responses.js";
import DatabaseManager from "./database.js";
import {SIGN_UP_PROC} from "../database/model/storedProcedures.js";

// Error messages
const SESSION_DOES_NOT_EXIST = {status: "fail", message: "Session does not exist. Please log in."};

// Middleware for checking if the session exists
const checkSessionMiddleware = checkSession(SESSION_DOES_NOT_EXIST)

// Dispatcher for handling requests
export default class Dispatcher {
    #app

    // Initialize the dispatcher
    constructor() {
        // Create a new instance of the app
        this.#app = express()

        // Add the body parser middleware
        this.#app.use(express.json())
        this.#app.use(express.urlencoded({extended: true}));

        // Add Helmet middleware for security
        this.#app.use(helmet());

        // Add Express Session middleware
        this.#app.use(Session.session)

        // Add the error catcher middleware
        this.#app.use(ErrorCatcher)

        // Set the signup route
        this.#app.post("/signup", this.signUp)

        // Set the login route
        this.#app.post("/login", this.logIn)

        // Set the logout route
        this.#app.post("/logout", checkSessionMiddleware, this.logOut)

        // Set the execute route
        this.#app.post("/execute", checkSessionMiddleware, this.Execute)
    }

    // Start the server
    start(port) {
        this.#app.listen(port, () => {
            Logger.info(`Server started on port: ${port}`)
        })
    }

    // Handle the signup request
    async signUp(req, res) {
        // Validate the request
        const [body, isValid] = HandleValidation(req, res, req=>Validate(req.body, SIGN_UP));
        if (!isValid) return;

        // Hash the password
        let error
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            // Check for errors
            if (err)
                error = err

            // Store the hashed password
            req.body.password_hash = hash
        })

        // Rethrow the error if any
        if (error)
             throw error

        // Handle the request
        let userID
        const queryRes= await DatabaseManager.query({text: SIGN_UP_PROC, values: [body.first_name, body.last_name, body.username, body.email, body.password_hash, null]})
        if (queryRes.rows.length > 0)
            userID = queryRes.rows[0]?.out_user_id

        // Check if the user was created
        if (!userID)
            throw new Error("User not created")
    }

    // Handle the login request
    logIn(req, res) {
        // Validate the request
        const [body, isValid] = HandleValidation(req, res, req =>Validate(req.body, LOG_IN));
        if (!isValid) return;

        // Handle the request
        // ...
    }

    // Handle the logout request
    logOut(req, res) {
        // Destroy the session
        Session.destroy(req)

        // Send the response
        res.status(200).json(successResponse())
    }

    // Handle the execute request
    Execute(req, res) {
        // Handle the request
        // ...
    }
}