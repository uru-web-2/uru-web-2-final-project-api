import DATABASE_MANAGER from "./database.js";
import {
    CREATE_METHODS,
    CREATE_MODULES,
    CREATE_OBJECTS,
    CREATE_PERMISSIONS,
    CREATE_PROFILES,
    CREATE_USER_EMAIL_VERIFICATIONS,
    CREATE_USER_EMAILS,
    CREATE_USER_PASSWORD_HASHES,
    CREATE_USER_PROFILES,
    CREATE_USER_USERNAMES,
    CREATE_USERS
} from "../database/model/createTables.js";
import {
    CREATE_GET_USER_PROFILES_FN,
    CREATE_LOAD_METHODS_FN,
    CREATE_LOAD_MODULES_FN,
    CREATE_LOAD_OBJECTS_FN,
    CREATE_LOAD_PERMISSIONS_FN,
    CREATE_LOAD_PROFILES_FN
} from "../database/model/createFunctions.js";
import {
    CREATE_LOG_IN_PROC,
    CREATE_SIGN_UP_PROC
} from "../database/model/createStoredProcedures.js";
import Logger from "./logger.js";
import {INSERT_PROFILES} from "../database/model/insertProfiles.js";

// Migrate the database
export default async function migrate() {
    // Create tables, functions, and stored procedures in the database if they do not exist
    await DATABASE_MANAGER.runTransaction(async (client) => {
        // Create the tables
        for (const query of [CREATE_MODULES, CREATE_OBJECTS, CREATE_METHODS, CREATE_USERS, CREATE_PROFILES, CREATE_PERMISSIONS, CREATE_USER_USERNAMES, CREATE_USER_PASSWORD_HASHES, CREATE_USER_EMAILS, CREATE_USER_EMAIL_VERIFICATIONS, CREATE_USER_PROFILES])
            await client.rawQuery(query)

        Logger.info("Tables created")

        // Create the functions
        for (const query of [CREATE_LOAD_MODULES_FN, CREATE_LOAD_OBJECTS_FN, CREATE_LOAD_METHODS_FN, CREATE_LOAD_PROFILES_FN, CREATE_LOAD_PERMISSIONS_FN, CREATE_GET_USER_PROFILES_FN])
            await client.rawQuery(query)

        Logger.info("Functions created")

        // Create the stored procedures
        for (const query of [CREATE_SIGN_UP_PROC, CREATE_LOG_IN_PROC])
            await client.rawQuery(query)

        Logger.info("Stored procedures created")
    }).then(() => Logger.info("Tables, functions, and stored procedures created")
    ).catch(err => Logger.error(`Tables, functions, and stored procedures creation failed: ${err}`))

    // Insert the profiles
    await DATABASE_MANAGER.runTransaction(async (client) => await client.rawQuery(INSERT_PROFILES)).then(() => Logger.info("Profiles inserted")
    ).catch(err => Logger.error(`Profiles insertion failed: ${err}`))
}