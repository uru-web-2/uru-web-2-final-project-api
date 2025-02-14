import './metadata.js'
import DatabaseManager from "./database.js";
import {
    CREATE_ARTICLE_ANNOTATIONS,
    CREATE_ARTICLE_JURY_MEMBERS,
    CREATE_ARTICLES,
    CREATE_BOOK_COPIES,
    CREATE_BOOK_COPY_LOANS,
    CREATE_BOOK_MODELS,
    CREATE_BOOKS,
    CREATE_COUNTRIES,
    CREATE_DOCUMENT_AUTHORS,
    CREATE_DOCUMENT_LOCATIONS,
    CREATE_DOCUMENT_REVIEWS,
    CREATE_DOCUMENT_TOPICS,
    CREATE_DOCUMENTS,
    CREATE_IDENTITY_DOCUMENTS,
    CREATE_LANGUAGES,
    CREATE_LOCATIONS,
    CREATE_MAGAZINE_ISSUES,
    CREATE_MAGAZINES,
    CREATE_METHODS,
    CREATE_MODULES,
    CREATE_OBJECTS,
    CREATE_PASSPORTS,
    CREATE_PEOPLE,
    CREATE_PERMISSIONS,
    CREATE_PERSON_POSITIONS,
    CREATE_POSTS,
    CREATE_PROFILES,
    CREATE_PUBLISHERS,
    CREATE_THESES,
    CREATE_TOPICS,
    CREATE_USER_EMAIL_VERIFICATIONS,
    CREATE_USER_EMAILS,
    CREATE_USER_PASSWORD_HASHES,
    CREATE_USER_PROFILES,
    CREATE_USER_USERNAMES,
    CREATE_USERS,
    CREATE_WORKS
} from "../database/model/createTables.js";
import {
    CREATE_GET_METHODS_FN,
    CREATE_GET_MODULES_FN,
    CREATE_GET_OBJECTS_FN,
    CREATE_GET_PERMISSIONS_FN,
    CREATE_GET_PROFILE_PERMISSIONS_METHODS_FN,
    CREATE_GET_PROFILES_FN,
    CREATE_GET_USER_PROFILES_FN,
} from "../database/model/createFunctions.js";
import {
    CREATE_ASSIGN_PROFILE_PERMISSION_PROC,
    CREATE_ASSIGN_USER_PROFILE_PROC,
    CREATE_CREATE_METHOD_PROC,
    CREATE_CREATE_METHOD_WITH_PROFILES_PROC,
    CREATE_CREATE_MODULE_PROC,
    CREATE_CREATE_OBJECT_PROC,
    CREATE_CREATE_PROFILE_PROC,
    CREATE_DELETE_ALL_MODULES_PROC,
    CREATE_DELETE_PROFILE_PROC,
    CREATE_GET_USER_ID_BY_USERNAME_PROC,
    CREATE_IS_METHOD_ID_VALID_PROC,
    CREATE_IS_PROFILE_ID_VALID_PROC,
    CREATE_LOG_IN_PROC,
    CREATE_REVOKE_PROFILE_PERMISSION_PROC,
    CREATE_REVOKE_USER_PROFILE_PROC,
    CREATE_SIGN_UP_PROC,
    CREATE_UPDATE_PROFILE_PROC
} from "../database/model/createStoredProcedures.js";
import Logger from "./logger.js";
import {MigratePermissions} from "@ralvarezdev/js-module-permissions";
import {__dirname} from "../router/constants.js";
import {INSERT_COUNTRIES, INSERT_PROFILES} from "../database/model/inserts.js";
import {
    CREATE_METHOD_WITH_PROFILES_PROC,
    CREATE_MODULE_PROC,
    CREATE_OBJECT_PROC
} from "../database/model/storedProcedures.js";
import {GET_PROFILES_FN} from "../database/model/functions.js";
import {classNameFn, instanceNameFn, matchScriptNameFn} from "./reflection.js";

// Print the root module recursively
function printModule(module, ...parentModules) {
    // Check if the parent modules are empty
    let modulesName
    if (parentModules.length === 0) {
        modulesName = ["router"]
    } else {
        modulesName = [...parentModules, module.name]
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

// Migrate module recursively
async function migrateModule(profilesID, module, client, parentModuleID = null) {
    // Insert the module
    let queryRes = await client.rawQuery(
        CREATE_MODULE_PROC,
        null,
        module.name,
        parentModuleID,
        null
    )
    const queryRows = queryRes?.rows?.[0]

    // Check if the module was inserted
    const moduleID = queryRows?.out_module_id
    if (!moduleID) {
        Logger.error(`Module ${module.name} insertion failed`)
        return
    }

    // Log the module
    Logger.info(`Module ${module.name} inserted with ID ${moduleID}`)

    // Iterate over the objects
    for (const objectName of Object.keys(module.objects)) {
        // Get the object
        const object = module.getObject(objectName)

        // Insert the object
        queryRes = await client.rawQuery(
            CREATE_OBJECT_PROC,
            null,
            objectName,
            moduleID,
            null,
        )
        const queryRows = queryRes?.rows?.[0]

        // Check if the object was inserted
        const objectID = queryRows?.out_object_id
        if (!objectID) {
            Logger.error(`Object ${objectName} insertion failed with parent module ID ${moduleID}`)
            return
        }

        // Log the object
        Logger.info(`Object ${objectName} inserted with ID ${objectID} and parent module ID ${moduleID}`)

        // Iterate over the methods
        for (const methodName of Object.keys(object.methods)) {
            // Get the method
            const method = object.getMethod(methodName)

            // Map the allowed profiles name to its ID
            const allowedProfilesID = []
            for (const profileName of method.allowedProfiles) {
                // Check if the profile exists
                const allowedProfileID = profilesID?.[profileName]
                if (!allowedProfileID) {
                    Logger.error(`Profile ${profileName} does not exist in the profiles ID map`)
                    return
                }
                allowedProfilesID.push(allowedProfileID)
            }

            // Insert the method
            const queryRes = await client.rawQuery(
                CREATE_METHOD_WITH_PROFILES_PROC,
                null,
                methodName,
                objectID,
                allowedProfilesID,
                null
            )
            const queryRows = queryRes?.rows?.[0]

            // Check if the method was inserted
            const methodID = queryRows?.out_method_id
            if (!methodID) {
                Logger.error(`Method ${methodName} insertion failed with parent object ID ${objectID}`)
                return
            }

            // Log the method
            Logger.info(`Method ${methodName} inserted with ID ${methodID} and parent object ID ${objectID}`)
        }
    }

    // Iterate over the nested modules
    for (const nestedModuleName of Object.keys(module.nestedModules)) {
        // Get the nested module
        const nestedModule = module.getNestedModule(nestedModuleName)

        // Migrate the nested module
        await migrateModule(profilesID, nestedModule, client, moduleID)
    }
}

// Migrate the database
export default async function migrate() {
    // Log the migration
    Logger.info("Migrating the database")

    // Create tables, functions, and stored procedures in the database if they do not exist
    await DatabaseManager.runTransaction(async (client) => {
        // Create the tables
        for (const query of [CREATE_COUNTRIES, CREATE_PASSPORTS, CREATE_IDENTITY_DOCUMENTS, CREATE_PEOPLE, CREATE_USERS, CREATE_MODULES, CREATE_OBJECTS, CREATE_METHODS, CREATE_PERSON_POSITIONS, CREATE_PROFILES, CREATE_PERMISSIONS, CREATE_USER_USERNAMES, CREATE_USER_PASSWORD_HASHES, CREATE_USER_EMAILS, CREATE_USER_EMAIL_VERIFICATIONS, CREATE_USER_PROFILES, CREATE_DOCUMENTS, CREATE_POSTS, CREATE_LOCATIONS, CREATE_DOCUMENT_AUTHORS, CREATE_DOCUMENT_LOCATIONS, CREATE_DOCUMENT_REVIEWS, CREATE_TOPICS, CREATE_DOCUMENT_TOPICS, CREATE_PUBLISHERS, CREATE_BOOKS, CREATE_LANGUAGES, CREATE_BOOK_MODELS, CREATE_BOOK_COPIES, CREATE_BOOK_COPY_LOANS, CREATE_WORKS, CREATE_ARTICLES, CREATE_ARTICLE_JURY_MEMBERS, CREATE_ARTICLE_ANNOTATIONS, CREATE_THESES,
            CREATE_MAGAZINES, CREATE_MAGAZINE_ISSUES])
            await client.rawQuery(query)

        Logger.info("Tables created")

        // Create the functions
        for (const query of [CREATE_GET_MODULES_FN, CREATE_GET_OBJECTS_FN, CREATE_GET_METHODS_FN, CREATE_GET_USER_PROFILES_FN, CREATE_GET_PROFILE_PERMISSIONS_METHODS_FN, CREATE_GET_PROFILES_FN, CREATE_GET_PERMISSIONS_FN])
            await client.rawQuery(query)

        Logger.info("Functions created")

        // Create the stored procedures
        for (const query of [CREATE_SIGN_UP_PROC, CREATE_LOG_IN_PROC,
            CREATE_IS_METHOD_ID_VALID_PROC,
            CREATE_IS_PROFILE_ID_VALID_PROC,
            CREATE_GET_USER_ID_BY_USERNAME_PROC,
            CREATE_ASSIGN_USER_PROFILE_PROC,
            CREATE_REVOKE_USER_PROFILE_PROC,
            CREATE_ASSIGN_PROFILE_PERMISSION_PROC,
            CREATE_REVOKE_PROFILE_PERMISSION_PROC,
            CREATE_CREATE_PROFILE_PROC,
            CREATE_UPDATE_PROFILE_PROC,
            CREATE_DELETE_PROFILE_PROC,
            CREATE_CREATE_MODULE_PROC,
            CREATE_CREATE_OBJECT_PROC,
            CREATE_CREATE_METHOD_PROC,
            CREATE_DELETE_ALL_MODULES_PROC,
            CREATE_CREATE_METHOD_WITH_PROFILES_PROC,])
            await client.rawQuery(query)

        Logger.info("Stored procedures created")
    }).then(
        () => Logger.info("Tables, functions, and stored procedures created")
    ).catch(
        err => Logger.error(`Tables, functions, and stored procedures creation failed: ${err}`)
    )

    // Insert the profiles
    await DatabaseManager.rawQuery(INSERT_PROFILES).then(
        () => Logger.info("Profiles inserted")
    ).catch(
        err => Logger.error(`Profiles insertion failed: ${err}`)
    )

    // Insert the countries
    await DatabaseManager.rawQuery(INSERT_COUNTRIES).then(
        () => Logger.info("Countries inserted")
    ).catch(
        err => Logger.error(`Countries insertion failed: ${err}`)
    )

    // Get the profiles
    let queryRes = await DatabaseManager.rawQuery(GET_PROFILES_FN)
    queryRes = queryRes?.rows

    // Create the profiles ID map
    const profilesID = queryRes.reduce((acc, profile) => {
        acc[profile.name] = profile.id
        return acc
    }, {})

    // Load the metadata profiles
    const rootModule = await MigratePermissions({
        dirPath: __dirname,
        matchScriptNameFn,
        classNameFn,
        instanceNameFn,
        logger: Logger
    })

    // Print the root module
    printModule(rootModule)

    // Migrate the root module
    await DatabaseManager.runTransaction(async (client) => {
        // Migrate the root module nested modules
        for (const nestedModuleName of Object.keys(rootModule.nestedModules)) {
            // Get the nested module
            const nestedModule = rootModule.getNestedModule(nestedModuleName)

            // Migrate the nested module
            await migrateModule(profilesID, nestedModule, client)
        }
    })
}