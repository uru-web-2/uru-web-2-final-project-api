import './metadata.js'
import DATABASE_MANAGER from "./database.js";
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
    CREATE_GET_OBJECTS_FN, CREATE_GET_PERMISSIONS_FN,
    CREATE_GET_PROFILE_PERMISSIONS_METHODS_FN, CREATE_GET_PROFILES_FN,
    CREATE_GET_USER_PROFILES_FN,
} from "../database/model/createFunctions.js";
import {
    CREATE_ASSIGN_PROFILE_PERMISSION_PROC,
    CREATE_ASSIGN_USER_PROFILE_PROC, CREATE_CREATE_METHOD_PROC,
    CREATE_CREATE_MODULE_PROC,
    CREATE_CREATE_OBJECT_PROC,
    CREATE_CREATE_PROFILE_PROC, CREATE_DELETE_ALL_MODULES_PROC,
    CREATE_DELETE_PROFILE_PROC,
    CREATE_GET_USER_ID_BY_USERNAME_PROC,
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

// Excluded script names RegExp
const EXCLUDED_SCRIPT_NAMES = /.*(?:Model|Service|Validator)\.js$|^constants\.js$/

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

// Migrate the database
export default async function migrate() {
    // Log the migration
    Logger.info("Migrating the database")

    // Create tables, functions, and stored procedures in the database if they do not exist
    await DATABASE_MANAGER.runTransaction(async (client) => {
        // Create the tables
        for (const query of [CREATE_COUNTRIES, CREATE_PASSPORTS, CREATE_IDENTITY_DOCUMENTS, CREATE_PEOPLE, CREATE_MODULES, CREATE_OBJECTS, CREATE_METHODS, CREATE_USERS, CREATE_PERSON_POSITIONS, CREATE_PROFILES, CREATE_PERMISSIONS, CREATE_USER_USERNAMES, CREATE_USER_PASSWORD_HASHES, CREATE_USER_EMAILS, CREATE_USER_EMAIL_VERIFICATIONS, CREATE_USER_PROFILES, CREATE_DOCUMENTS, CREATE_POSTS, CREATE_LOCATIONS, CREATE_DOCUMENT_AUTHORS, CREATE_DOCUMENT_LOCATIONS, CREATE_DOCUMENT_REVIEWS, CREATE_TOPICS, CREATE_DOCUMENT_TOPICS, CREATE_PUBLISHERS, CREATE_BOOKS, CREATE_LANGUAGES, CREATE_BOOK_MODELS, CREATE_BOOK_COPIES, CREATE_BOOK_COPY_LOANS, CREATE_WORKS, CREATE_ARTICLES, CREATE_ARTICLE_JURY_MEMBERS, CREATE_ARTICLE_ANNOTATIONS, CREATE_THESES,
            CREATE_MAGAZINES, CREATE_MAGAZINE_ISSUES])
            await client.rawQuery(query)

        Logger.info("Tables created")

        // Create the functions
        for (const query of [CREATE_GET_MODULES_FN, CREATE_GET_OBJECTS_FN, CREATE_GET_METHODS_FN,CREATE_GET_USER_PROFILES_FN, CREATE_GET_PROFILE_PERMISSIONS_METHODS_FN, CREATE_GET_PROFILES_FN, CREATE_GET_PERMISSIONS_FN])
            await client.rawQuery(query)

        Logger.info("Functions created")

        // Create the stored procedures
        for (const query of [CREATE_SIGN_UP_PROC, CREATE_LOG_IN_PROC,
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
CREATE_DELETE_ALL_MODULES_PROC,])
            await client.rawQuery(query)

        Logger.info("Stored procedures created")
    }).then(
        () => Logger.info("Tables, functions, and stored procedures created")
    ).catch(
        err => Logger.error(`Tables, functions, and stored procedures creation failed: ${err}`)
    )

    // Insert the profiles
    await DATABASE_MANAGER.rawQuery(INSERT_PROFILES).then(
        () => Logger.info("Profiles inserted")
    ).catch(
        err => Logger.error(`Profiles insertion failed: ${err}`)
    )

    // Insert the countries
    await DATABASE_MANAGER.rawQuery(INSERT_COUNTRIES).then(
        () => Logger.info("Countries inserted")
    ).catch(
        err => Logger.error(`Countries insertion failed: ${err}`)
    )

    // Load the metadata profiles
    const rootModule = await MigratePermissions({
        dirPath: __dirname,
        matchScriptNameFn: (scriptName) => {
            // Check if the script name matches with an excluded script name
            return !EXCLUDED_SCRIPT_NAMES.test(scriptName)
        },
        classNameFn: (scriptPath, scriptName) => {
            // Should return the name of the script, without the extension and with the first letter capitalized
            scriptName = scriptName.replace(".js", "")
            return scriptName.charAt(0).toUpperCase() + scriptName.slice(1)
        },
        instanceNameFn: (scriptPath, scriptName) => {
            // Should be default export of the script
            return "default"
        },
        logger: Logger
    })

    // Print the root module
    printModule(rootModule)
}