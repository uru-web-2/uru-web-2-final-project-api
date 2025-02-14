import Session, {
    checkSession as createCheckSession
} from "@ralvarezdev/js-session"
import Logger from "./logger.js";
import {IS_PROD} from "@ralvarezdev/js-mode";

// Error messages
const SESSION_DOES_NOT_EXIST = {
    status: "fail",
    message: "Session does not exist. Please log in."
};

// Session config
const SESSION_CONFIG = {
    logger: Logger,
    cookie: {
        expires: parseInt(process.env.URU_WEB_2_FINAL_PROJECT_SESSION_EXPIRES),
        httpOnly: process.env.URU_WEB_2_FINAL_PROJECT_SESSION_HTTP_ONLY === "true",
        secure: IS_PROD,
    },
    name: process.env.URU_WEB_2_FINAL_PROJECT_SESSION_NAME,
    secret: process.env.URU_WEB_2_FINAL_PROJECT_API_SECRET
}

// Initialize Express Session wrapper
const SESSION = new Session(SESSION_CONFIG)
export default SESSION

// Middleware for checking if the session exists
export const checkSession = createCheckSession(SESSION_DOES_NOT_EXIST)