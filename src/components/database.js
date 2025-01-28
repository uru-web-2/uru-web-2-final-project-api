import {PostgresDatabaseManager} from "@ralvarezdev/js-dbmanager";
import Logger from "./logger.js";

// Database configuration
const DATABASE_CONFIG = {
    host: process.env.URU_WEB_2_FINAL_PROJECT_API_POSTGRES_HOST,
    user: process.env.URU_WEB_2_FINAL_PROJECT_API_POSTGRES_USER,
    password: process.env.URU_WEB_2_FINAL_PROJECT_API_POSTGRES_PASSWORD,
    database: process.env.URU_WEB_2_FINAL_PROJECT_API_POSTGRES_NAME,
    ssl: true,
    max: process.env.URU_WEB_2_FINAL_PROJECT_API_POSTGRES_MAX_CONNECTIONS,
    onConnect: (client) => {
        Logger.info("Connected to database")
    },
    onAcquire: (client) => {
        Logger.info("Acquired database connection")
    },
    onError: (err, client) => {
        Logger.error(`Database error: ${err}`)
    },
    onRelease: (err, client) => {
        Logger.info("Released database connection")
    },
    onRemove: (client) => {
        Logger.info("Removed database connection")
    }
}

// Initialize PostgresDatabaseManager
const DATABASE_MANAGER = new PostgresDatabaseManager(DATABASE_CONFIG)
export default DATABASE_MANAGER