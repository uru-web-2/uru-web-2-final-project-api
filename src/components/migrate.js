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
import {MigratePermissions} from "@ralvarezdev/js-module-permissions";
import {__dirname} from "../router/constants.js";
import {
    DEFAULT_OBJECT_CLASS_NAME, DEFAULT_OBJECT_INSTANCE_NAME,
    DEFAULT_SCRIPT_NAME,
    ROOT_MODULE_MANAGER
} from "./security.js";

// Print the root module recursively
function printModule(module, ...parentModules) {
    // Check if the parent modules are empty
    let modulesName
    if (parentModules.length === 0){
        modulesName = ["router"]
    }else{
        modulesName=[...parentModules, module.name]
    }

    // Get the module name
    const moduleName = modulesName.join(".")

    // Iterate over the objects
    for (const objectName of Object.keys(module.objects)) {
        // Get the object
        const object = module.getObject(objectName)

        // Iterate over the object methods
        for (const methodName of Object.keys(object.methods)) {
            // Get the method
            const method = object.getMethod(methodName)

            // Print the method
            console.log(`Module: ${moduleName}, Object: ${objectName}, Method: ${methodName}, Allowed Profiles: ${method.allowedProfiles}`)
        }
    }

    // Iterate over the modules
    for (const nestedModuleName of Object.keys(module.nestedModules)) {
        // Get the nested module
        const nestedModule = module.getNestedModule(nestedModuleName)

        // Print the nested module
        printModule(nestedModule, ...modulesName)
    }
}

// Migrate the database
export default async function migrate() {
    /*
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
    */

    // Insert the profiles
    /*
    await DATABASE_MANAGER.runTransaction(async (client) => await client.rawQuery(INSERT_PROFILES)).then(() => Logger.info("Profiles inserted")
    ).catch(err => Logger.error(`Profiles insertion failed: ${err}`))
     */

    // Load the metadata profiles
    const rootModule=await MigratePermissions({
        dirPath: __dirname,
        scriptName: DEFAULT_SCRIPT_NAME,
        className: DEFAULT_OBJECT_CLASS_NAME,
        instanceName: DEFAULT_OBJECT_INSTANCE_NAME,
        logger: Logger
    })

    // Print the root module
    printModule(rootModule)
}