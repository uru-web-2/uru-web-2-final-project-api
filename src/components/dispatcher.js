import express from "express";
import helmet from "helmet";
import Session from "./session.js";
import Logger from "./logger.js";

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
    }

    // Start the server
    start(port) {
        this.#app.listen(port, () => {
            Logger.info(`Server started on port: ${port}`)
        })
    }

}