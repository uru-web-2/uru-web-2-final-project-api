import DatabaseManager from "@ralvarezdev/js-dbmanager";
import LOGGER from "./logger.js";
import {
    CREATE_METHODS,
    CREATE_MODULES,
    CREATE_OBJECTS,
    CREATE_PERMISSIONS,
    CREATE_PROFILES,
    CREATE_USER_EMAILS,
    CREATE_USER_EMAIL_VERIFICATIONS,
    CREATE_USER_PASSWORD_HASHES,
    CREATE_USERS,
    CREATE_USER_USERNAMES, CREATE_USER_PROFILES
} from "../database/model/createTables.js";
import {
    CREATE_LOAD_METHODS_FN,
    CREATE_LOAD_MODULES_FN,
    CREATE_LOAD_OBJECTS_FN, CREATE_LOAD_PERMISSIONS_FN, CREATE_LOAD_PROFILES_FN
} from "../database/model/createFunctions.js";

// Database configuration
const DATABASE_CONFIG = {
    host: process.env.URU_WEB_2_FINAL_PROJECT_POSTGRES_HOST,
    user: process.env.URU_WEB_2_FINAL_PROJECT_POSTGRES_USER,
    password: process.env.URU_WEB_2_FINAL_PROJECT_POSTGRES_PASSWORD,
    database: process.env.URU_WEB_2_FINAL_PROJECT_POSTGRES_NAME,
    ssl: true,
    max: process.env.URU_WEB_2_FINAL_PROJECT_POSTGRES_MAX_CONNECTIONS,
    onConnect: (client) => {
        LOGGER.info("Connected to database")
    },
    onAcquire: (client) => {
        LOGGER.info("Acquired database connection")
    },
    onError: (err, client) => {
        LOGGER.error(`Database error: ${err}`)
    },
    onRelease: (err, client) => {
        LOGGER.info("Released database connection")
    },
    onRemove: (client) => {
        LOGGER.info("Removed database connection")
    }
}

// Initialize DatabaseManager
const DATABASE_MANAGER = new DatabaseManager({...DATABASE_CONFIG})
export default DATABASE_MANAGER

// Create tables if they don't exist
DATABASE_MANAGER.runTransaction(async (client) => {
    // Create tables
    for (let query of [CREATE_MODULES, CREATE_OBJECTS, CREATE_METHODS, CREATE_USERS, CREATE_PROFILES, CREATE_PERMISSIONS, CREATE_USER_USERNAMES, CREATE_USER_PASSWORD_HASHES, CREATE_USER_EMAILS, CREATE_USER_EMAIL_VERIFICATIONS, CREATE_USER_PROFILES])
        client.query(query)

    // Create functions
    for (let query of [CREATE_LOAD_MODULES_FN, CREATE_LOAD_OBJECTS_FN, CREATE_LOAD_METHODS_FN, CREATE_LOAD_PROFILES_FN, CREATE_LOAD_PERMISSIONS_FN])
        client.query(query)
}).then(r => {
    LOGGER.info("Tables created")
}).catch(err => {
    LOGGER.error(`Error creating tables: ${err}`)
})