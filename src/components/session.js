import Session, {checkSession} from "@ralvarezdev/js-session"
import Logger from "./logger.js";
import {IS_PROD} from "@ralvarezdev/js-mode";
import {FailJSendBody} from "@ralvarezdev/js-express";

// Session config
const SESSION_CONFIG = {
    logger: Logger,
    cookie: {
        maxAge: parseInt(process.env.URU_WEB_2_FINAL_PROJECT_SESSION_MAX_AGE),
        httpOnly: process.env.URU_WEB_2_FINAL_PROJECT_SESSION_HTTP_ONLY === "true",
        secure: IS_PROD,
    },
    name: process.env.URU_WEB_2_FINAL_PROJECT_SESSION_NAME,
    secret: process.env.URU_WEB_2_FINAL_PROJECT_API_SECRET
}

// Initialize Express Session wrapper
export default new Session(SESSION_CONFIG)

// Middleware for checking if the session exists
export const sessionExists = checkSession((req, res) => {
    if (req.session.userID)
        return true

    // Session does not exist
    res.status(401).json(FailJSendBody({
        session: "Session does not exist. Please log in."
    }))
})