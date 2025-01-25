import {Wrapper as Session} from "@ralvarezdev/js-session/express"
import Logger from "./logger.js";

// Session config
const SESSION_CONFIG = {
    logger: Logger,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: true,
        secure: true,
    },
    secret: process.env.URU_WEB_2_FINAL_PROJECT_BACKEND_SECRET
}

// Initialize Express Session wrapper
const SESSION = new Session({...SESSION_CONFIG})
export default SESSION
