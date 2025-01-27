import {PostgresDatabaseManager} from "@ralvarezdev/js-dbmanager";
import Logger from "./logger.js";
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
import {CREATE_SIGN_UP_PROC} from "../database/model/createStoredProcedures.js";

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

// Create tables, functions, and stored procedures in the database if they do not exist
DATABASE_MANAGER.runTransaction(async (client) => {
    // Create the tables
    for (const query of [CREATE_MODULES, CREATE_OBJECTS, CREATE_METHODS, CREATE_USERS, CREATE_PROFILES, CREATE_PERMISSIONS, CREATE_USER_USERNAMES, CREATE_USER_PASSWORD_HASHES, CREATE_USER_EMAILS, CREATE_USER_EMAIL_VERIFICATIONS, CREATE_USER_PROFILES])
        await client.rawQuery(query)

    Logger.info("Tables created")

    // Create the functions
    for (const query of [CREATE_LOAD_MODULES_FN, CREATE_LOAD_OBJECTS_FN, CREATE_LOAD_METHODS_FN, CREATE_LOAD_PROFILES_FN, CREATE_LOAD_PERMISSIONS_FN])
        await client.rawQuery(query)

    Logger.info("Functions created")

    // Create the stored procedures
    for (const query of [CREATE_SIGN_UP_PROC])
        await client.rawQuery(query)

    Logger.info("Stored procedures created")
}).then(r => {
    Logger.info("Database migration complete")
}).catch(err => {
    Logger.error(`Database migration failed: ${err}`)
})