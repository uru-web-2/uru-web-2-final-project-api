import './metadata.js'
import DatabaseManager from "./database.js";
import {
    CREATE_ARTICLE_ANNOTATIONS,
    CREATE_ARTICLE_JURY_MEMBERS,
    CREATE_ARTICLES,
    CREATE_AUDIT_ENTRIES,
    CREATE_BOOK_COPIES,
    CREATE_BOOK_COPY_LOANS,
    CREATE_BOOKS,
    CREATE_COUNTRIES,
    CREATE_DOCUMENT_IMAGES,
    CREATE_DOCUMENT_LANGUAGES,
    CREATE_DOCUMENT_LOCATION_SECTIONS,
    CREATE_DOCUMENT_REVIEWS,
    CREATE_DOCUMENT_TOPICS,
    CREATE_DOCUMENTS,
    CREATE_IDENTITY_DOCUMENTS,
    CREATE_LANGUAGES,
    CREATE_LOCATION_SECTIONS,
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
    CREATE_USER_EMAIL_VERIFICATION_TOKENS,
    CREATE_USER_EMAILS,
    CREATE_USER_PASSWORD_HASHES,
    CREATE_USER_PROFILES,
    CREATE_USER_RESET_PASSWORD_TOKENS,
    CREATE_USER_USERNAMES,
    CREATE_USERS,
    CREATE_WORKS
} from "../database/model/createTables.js";
import {
    CREATE_GET_ALL_COUNTRIES_FN,
    CREATE_GET_ALL_LANGUAGES_FN,
    CREATE_GET_ALL_LOCATION_SECTIONS_FN,
    CREATE_GET_ALL_LOCATIONS_FN, CREATE_GET_ALL_MAGAZINES_FN,
    CREATE_GET_ALL_METHODS_FN,
    CREATE_GET_ALL_MODULES_FN,
    CREATE_GET_ALL_OBJECTS_FN,
    CREATE_GET_ALL_PERMISSIONS_FN,
    CREATE_GET_ALL_PROFILES_FN,
    CREATE_GET_ALL_PUBLISHERS_FN,
    CREATE_GET_ALL_TOPICS_FN,
    CREATE_GET_ALL_TOPICS_NAME_FN,
    CREATE_GET_ALL_USER_PROFILES_FN,
    CREATE_GET_ALL_USERS_FN,
    CREATE_GET_DOCUMENT_LANGUAGES_BY_DOCUMENT_ID_FN,
    CREATE_GET_DOCUMENT_LOCATION_SECTIONS_BY_DOCUMENT_ID_FN,
    CREATE_GET_DOCUMENT_TOPICS_BY_DOCUMENT_ID_FN,
    CREATE_GET_LOCATION_SECTIONS_BY_LOCATION_ID_FN,
    CREATE_GET_METHODS_BY_OBJECT_ID_FN,
    CREATE_GET_METHODS_BY_PROFILE_ID_OBJECT_ID_FN,
    CREATE_GET_MODULES_BY_PROFILE_ID_FN,
    CREATE_GET_OBJECTS_BY_MODULE_ID_FN,
    CREATE_GET_OBJECTS_BY_PROFILE_ID_MODULE_ID_FN,
    CREATE_GET_PROFILE_PERMISSIONS_METHODS_FN,
    CREATE_SEARCH_COUNTRY_BY_NAME_FN,
    CREATE_SEARCH_LANGUAGE_BY_NAME_FN, CREATE_SEARCH_MAGAZINE_BY_NAME_FN,
    CREATE_SEARCH_PROFILE_BY_NAME_FN,
    CREATE_SEARCH_PUBLISHER_BY_NAME_FN,
    CREATE_SEARCH_TOPIC_BY_NAME_FN,
    CREATE_SEARCH_USER_BY_USERNAME_FN,
} from "../database/model/createFunctions.js";
import {
    CREATE_CREATE_ARTICLE_JURY_MEMBER_PROC,
    CREATE_CREATE_DOCUMENT_LANGUAGE_PROC,
    CREATE_CREATE_DOCUMENT_LOCATION_SECTION_PROC,
    CREATE_CREATE_DOCUMENT_TOPIC_PROC,
    CREATE_CREATE_PROFILE_PERMISSION_PROC,
    CREATE_CREATE_USER_PROFILE_PROC,
    CREATE_CREATE_ARTICLE_ANNOTATION_PROC,
    CREATE_CREATE_ARTICLE_PROC,
    CREATE_CREATE_AUDIT_ENTRY_PROC,
    CREATE_CREATE_BOOK_COPY_PROC,
    CREATE_CREATE_BOOK_PROC,
    CREATE_CREATE_DOCUMENT_IMAGE_PROC,
    CREATE_CREATE_DOCUMENT_PROC,
    CREATE_CREATE_DOCUMENT_REVIEW_PROC,
    CREATE_CREATE_LOCATION_PROC,
    CREATE_CREATE_LOCATION_SECTION_PROC,
    CREATE_CREATE_MAGAZINE_ISSUE_PROC,
    CREATE_CREATE_MAGAZINE_PROC,
    CREATE_CREATE_METHOD_PROC,
    CREATE_CREATE_METHOD_WITH_PROFILES_PROC,
    CREATE_CREATE_MODULE_PROC,
    CREATE_CREATE_OBJECT_PROC,
    CREATE_CREATE_PERSON_PROC,
    CREATE_CREATE_POST_PROC,
    CREATE_CREATE_PROFILE_PROC,
    CREATE_CREATE_PUBLISHER_PROC,
    CREATE_CREATE_THESIS_PROC,
    CREATE_CREATE_TOPIC_PROC,
    CREATE_CREATE_USER_EMAIL_PROC,
    CREATE_CREATE_USER_EMAIL_VERIFICATION_TOKEN_PROC,
    CREATE_CREATE_USER_PERSONAL_DOCUMENT_PROC,
    CREATE_CREATE_USER_PROC,
    CREATE_CREATE_USER_RESET_PASSWORD_TOKEN_PROC,
    CREATE_CREATE_WORK_PROC,
    CREATE_REMOVE_ALL_MODULES_PROC,
    CREATE_REMOVE_BOOK_COPY_LOAN_PROC,
    CREATE_REMOVE_BOOK_COPY_PROC,
    CREATE_REMOVE_DOCUMENT_IMAGE_PROC,
    CREATE_REMOVE_DOCUMENT_PROC,
    CREATE_REMOVE_DOCUMENT_REVIEW_PROC,
    CREATE_REMOVE_LOCATION_PROC,
    CREATE_REMOVE_LOCATION_SECTION_PROC,
    CREATE_REMOVE_MAGAZINE_PROC,
    CREATE_REMOVE_POST_PROC,
    CREATE_REMOVE_PROFILE_PROC,
    CREATE_REMOVE_PUBLISHER_PROC,
    CREATE_REMOVE_TOPIC_PROC,
    CREATE_REMOVE_USER_PERSONAL_DOCUMENT_PROC,
    CREATE_GET_COUNTRY_ID_BY_NAME_PROC,
    CREATE_GET_DOCUMENT_ID_BY_BOOK_ID_PROC,
    CREATE_GET_DOCUMENT_ID_BY_WORK_ID_PROC,
    CREATE_GET_METHOD_ID_BY_NAME_PROC,
    CREATE_GET_MODULE_ID_BY_NAME_PROC,
    CREATE_GET_NUMBER_OF_USERS_PROC,
    CREATE_GET_OBJECT_ID_BY_NAME_PROC,
    CREATE_GET_PERMISSION_ID_BY_PROFILE_ID_METHOD_ID_PROC,
    CREATE_GET_USER_DETAILS_BY_USER_ID_PROC,
    CREATE_GET_USER_EMAIL_INFO_BY_USER_EMAIL_PROC,
    CREATE_GET_USER_EMAIL_INFO_BY_USER_ID_PROC,
    CREATE_GET_USER_ID_BY_USERNAME_PROC,
    CREATE_GET_WORK_ID_BY_DOCUMENT_ID_PROC,
    CREATE_IS_METHOD_ID_VALID_PROC,
    CREATE_IS_PROFILE_ID_VALID_PROC,
    CREATE_LOG_IN_PROC,
    CREATE_REGISTER_BOOK_COPY_LOAN_WITH_RESERVATION_PROC,
    CREATE_REGISTER_BOOK_COPY_LOAN_WITHOUT_RESERVATION_PROC,
    CREATE_REMOVE_ARTICLE_JURY_MEMBER_PROC,
    CREATE_REMOVE_DOCUMENT_LANGUAGE_PROC,
    CREATE_REMOVE_DOCUMENT_LOCATION_SECTION_PROC,
    CREATE_REMOVE_DOCUMENT_TOPIC_PROC,
    CREATE_REPLACE_USER_PERSONAL_DOCUMENT_PROC,
    CREATE_RESET_USER_PASSWORD_PROC,
    CREATE_RESOLVE_ARTICLE_ANNOTATION_PROC,
    CREATE_REMOVE_PROFILE_PERMISSION_PROC,
    CREATE_REMOVE_USER_EMAIL_VERIFICATION_TOKEN_BY_USER_EMAIL_ID_PROC,
    CREATE_REMOVE_USER_PROFILE_PROC,
    CREATE_REMOVE_USER_RESET_PASSWORD_TOKEN_BY_USER_ID_PROC,
    CREATE_SET_BOOK_COPY_AS_LOST_PROC,
    CREATE_SET_BOOK_COPY_LOAN_AS_LOST_PROC,
    CREATE_SET_BOOK_COPY_LOAN_AS_RETURNED_PROC,
    CREATE_SET_BOOK_COPY_LOAN_RESERVATION_AS_BORROWED_PROC,
    CREATE_SET_METHOD_PERMISSIONS_PROC,
    CREATE_SET_PROFILE_PERMISSIONS_PROC,
    CREATE_UPDATE_ARTICLE_ANNOTATION_PROC,
    CREATE_UPDATE_ARTICLE_PROC,
    CREATE_UPDATE_BOOK_COPY_PROC,
    CREATE_UPDATE_BOOK_PROC,
    CREATE_UPDATE_DOCUMENT_PROC,
    CREATE_UPDATE_DOCUMENT_REVIEW_PROC,
    CREATE_UPDATE_LOCATION_PROC,
    CREATE_UPDATE_LOCATION_SECTION_PROC,
    CREATE_UPDATE_MAGAZINE_ISSUE_PROC,
    CREATE_UPDATE_MAGAZINE_PROC,
    CREATE_UPDATE_POST_PROC,
    CREATE_UPDATE_PROFILE_PROC,
    CREATE_UPDATE_PUBLISHER_PROC,
    CREATE_UPDATE_THESIS_PROC,
    CREATE_UPDATE_TOPIC_PROC,
    CREATE_UPDATE_USER_BY_ADMIN_PROC,
    CREATE_UPDATE_USER_EMAIL_PROC,
    CREATE_UPDATE_USER_PASSWORD_HASH_PROC,
    CREATE_UPDATE_USER_USERNAME_PROC,
    CREATE_UPDATE_WORK_PROC,
    CREATE_VERIFY_USER_EMAIL_VERIFICATION_TOKEN_PROC,
    CREATE_GET_PERMISSIONS_BY_METHOD_ID_PROC
} from "../database/model/createStoredProcedures.js";
import Logger from "./logger.js";
import {MigratePermissions} from "@ralvarezdev/js-module-permissions";
import {__dirname} from "../router/constants.js";
import {
    INSERT_COUNTRIES,
    INSERT_LANGUAGES,
    INSERT_PROFILES
} from "../database/model/inserts.js";
import {
    CREATE_METHOD_WITH_PROFILES_PROC,
    CREATE_MODULE_PROC,
    CREATE_OBJECT_PROC,
    GET_METHOD_ID_BY_NAME_PROC, GET_PERMISSIONS_BY_METHOD_ID_PROC,
    GET_MODULE_ID_BY_NAME_PROC,
    GET_OBJECT_ID_BY_NAME_PROC,
    SET_METHOD_PERMISSIONS_PROC
} from "../database/model/storedProcedures.js";
import {GET_ALL_PROFILES_FN} from "../database/model/functions.js";
import {
    classNameFn,
    instanceNameFn,
    matchScriptNameFn,
    printModule
} from "./reflection.js";
import {PostgresIsUniqueConstraintError} from "@ralvarezdev/js-dbmanager";
import {
    METHODS_UNIQUE_OBJECT_ID_NAME,
    MODULES_UNIQUE_NAME, MODULES_UNIQUE_PARENT_MODULE_ID_NAME,
    OBJECTS_UNIQUE_MODULE_ID_NAME
} from "../database/model/constraints.js";
import {loadNode} from "@ralvarezdev/js-mode";

// Load environment variables
loadNode()

// Migrate module recursively
async function migrateModule(profilesID, module, parentModuleID = null) {
    let queryRes, queryRows

    try {
        // Insert the module
        queryRes = await DatabaseManager.rawQuery(
            CREATE_MODULE_PROC,
            null,
            module.name,
            parentModuleID,
            null
        )
    } catch (error) {
        // Log the error
        Logger.error(`Error inserting module ${module.name}: ${error}`)

        // Check if it is a constraint violation error
        const constraintName = PostgresIsUniqueConstraintError(error)

        // Check if the constraint is the unique name constraint
        if (constraintName !== MODULES_UNIQUE_NAME && constraintName !== MODULES_UNIQUE_PARENT_MODULE_ID_NAME)
            throw error

        // Get the module
        queryRes = await DatabaseManager.rawQuery(
            GET_MODULE_ID_BY_NAME_PROC,
            module.name,
            parentModuleID,
            null
        )
    }

    // Get the module ID
    const moduleID = queryRes.rows?.[0]?.out_module_id

    // Log the module
    Logger.info(`Module ${module.name} inserted/retrieved with ID ${moduleID}`)

    // Iterate over the objects
    for (const objectName of Object.keys(module.objects)) {
        // Get the object
        const object = module.getObject(objectName)

        // Insert the object
        try {
            queryRes = await DatabaseManager.rawQuery(
                CREATE_OBJECT_PROC,
                null,
                objectName,
                moduleID,
                null,
            )
        } catch (error) {
            // Log the error
            Logger.error(`Error inserting object ${objectName}: ${error}`)

            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the constraint is the unique name constraint
            if (constraintName !== OBJECTS_UNIQUE_MODULE_ID_NAME)
                throw error

            // Get the object
            queryRes = await DatabaseManager.rawQuery(
                GET_OBJECT_ID_BY_NAME_PROC,
                objectName,
                moduleID,
                null
            )
        }

        // Get the object ID
        queryRows = queryRes?.rows?.[0]
        const objectID = queryRows?.out_object_id

        // Log the object
        Logger.info(`Object ${objectName} inserted/retrieved with ID ${objectID} and parent module ID ${moduleID}`)

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
            let methodID
            try {
                queryRes = await DatabaseManager.rawQuery(
                    CREATE_METHOD_WITH_PROFILES_PROC,
                    null,
                    methodName,
                    objectID,
                    allowedProfilesID,
                    null
                )

                queryRows = queryRes?.rows?.[0]
                methodID = queryRows?.out_method_id
            } catch (error) {
                // Log the error
                Logger.error(`Error inserting method ${methodName}: ${error}`)

                // Check if it is a constraint violation error
                const constraintName = PostgresIsUniqueConstraintError(error)

                // Check if the constraint is the unique name constraint
                if (constraintName !== METHODS_UNIQUE_OBJECT_ID_NAME)
                    throw error

                // Get the method
                queryRes = await DatabaseManager.rawQuery(
                    GET_METHOD_ID_BY_NAME_PROC,
                    methodName,
                    objectID,
                    null
                )

                queryRows = queryRes?.rows?.[0]
                methodID = queryRows?.out_method_id

                // Get the current allowed profiles
                queryRes = await DatabaseManager.rawQuery(
                    GET_PERMISSIONS_BY_METHOD_ID_PROC,
                    methodID,
                    null
                )

                const currentAllowedProfilesID = queryRes.rows?.[0].out_allowed_profile_ids

                // Get the profiles ID to add
                const profilesIDToAdd = allowedProfilesID.filter((profileID) => !currentAllowedProfilesID.includes(profileID))

                // Get the profiles ID to remove
                const profilesIDToRemove = currentAllowedProfilesID.filter((profileID) => !allowedProfilesID.includes(profileID))

                // Set the method permissions
                await DatabaseManager.rawQuery(
                    SET_METHOD_PERMISSIONS_PROC,
                    null,
                    methodID,
                    profilesIDToAdd,
                    profilesIDToRemove
                )
            }

            // Log the method
            Logger.info(`Method ${methodName} inserted/retrieved with ID ${methodID} and parent object ID ${objectID}`)
        }
    }

    // Iterate over the nested modules
    for (const nestedModuleName of Object.keys(module.nestedModules)) {
        // Get the nested module
        const nestedModule = module.getNestedModule(nestedModuleName)

        // Migrate the nested module
        await migrateModule(profilesID, nestedModule, moduleID)
    }
}

// Migrate the database
export default async function migrate() {
    // Log the migration
    Logger.info("Migrating the database")

    // Create the tables
    await DatabaseManager.runTransaction(async (client) => {
        for (const query of [
            CREATE_COUNTRIES,
            CREATE_PASSPORTS,
            CREATE_IDENTITY_DOCUMENTS,
            CREATE_PEOPLE,
            CREATE_USERS,
            CREATE_MODULES,
            CREATE_OBJECTS,
            CREATE_METHODS,
            CREATE_PERSON_POSITIONS,
            CREATE_PROFILES,
            CREATE_PERMISSIONS,
            CREATE_USER_USERNAMES,
            CREATE_USER_PASSWORD_HASHES,
            CREATE_USER_EMAILS,
            CREATE_USER_EMAIL_VERIFICATION_TOKENS,
            CREATE_USER_RESET_PASSWORD_TOKENS,
            CREATE_USER_PROFILES,
            CREATE_DOCUMENTS,
            CREATE_POSTS,
            CREATE_LOCATIONS,
            CREATE_LOCATION_SECTIONS,
            CREATE_DOCUMENT_LOCATION_SECTIONS,
            CREATE_DOCUMENT_REVIEWS,
            CREATE_TOPICS,
            CREATE_DOCUMENT_TOPICS,
            CREATE_PUBLISHERS,
            CREATE_BOOKS,
            CREATE_LANGUAGES,
            CREATE_BOOK_COPIES,
            CREATE_BOOK_COPY_LOANS,
            CREATE_WORKS,
            CREATE_ARTICLES,
            CREATE_ARTICLE_JURY_MEMBERS,
            CREATE_ARTICLE_ANNOTATIONS,
            CREATE_THESES,
            CREATE_MAGAZINES,
            CREATE_MAGAZINE_ISSUES,
            CREATE_DOCUMENT_IMAGES,
            CREATE_DOCUMENT_LANGUAGES,
            CREATE_AUDIT_ENTRIES
        ])
            await client.rawQuery(query)
    })
    Logger.info("Tables created")

    // Create the functions
    await DatabaseManager.runTransaction(async (client) => {
        for (const query of [
            CREATE_GET_ALL_MODULES_FN,
            CREATE_GET_ALL_OBJECTS_FN,
            CREATE_GET_ALL_METHODS_FN,
            CREATE_GET_ALL_USER_PROFILES_FN,
            CREATE_GET_PROFILE_PERMISSIONS_METHODS_FN,
            CREATE_GET_ALL_PROFILES_FN,
            CREATE_GET_ALL_PERMISSIONS_FN,
            CREATE_SEARCH_PROFILE_BY_NAME_FN,
            CREATE_SEARCH_USER_BY_USERNAME_FN,
            CREATE_GET_ALL_USERS_FN,
            CREATE_GET_OBJECTS_BY_MODULE_ID_FN,
            CREATE_GET_METHODS_BY_OBJECT_ID_FN,
            CREATE_GET_MODULES_BY_PROFILE_ID_FN,
            CREATE_GET_OBJECTS_BY_PROFILE_ID_MODULE_ID_FN,
            CREATE_GET_METHODS_BY_PROFILE_ID_OBJECT_ID_FN,
            CREATE_GET_ALL_TOPICS_FN,
            CREATE_GET_ALL_TOPICS_NAME_FN,
            CREATE_GET_ALL_LANGUAGES_FN,
            CREATE_GET_ALL_PUBLISHERS_FN,
            CREATE_SEARCH_PUBLISHER_BY_NAME_FN,
            CREATE_SEARCH_TOPIC_BY_NAME_FN,
            CREATE_GET_ALL_COUNTRIES_FN,
            CREATE_SEARCH_COUNTRY_BY_NAME_FN,
            CREATE_SEARCH_LANGUAGE_BY_NAME_FN,
            CREATE_GET_ALL_LOCATIONS_FN,
            CREATE_GET_LOCATION_SECTIONS_BY_LOCATION_ID_FN,
            CREATE_GET_DOCUMENT_LANGUAGES_BY_DOCUMENT_ID_FN,
            CREATE_GET_DOCUMENT_TOPICS_BY_DOCUMENT_ID_FN,
            CREATE_GET_ALL_LOCATION_SECTIONS_FN,
            CREATE_GET_DOCUMENT_LOCATION_SECTIONS_BY_DOCUMENT_ID_FN,
            CREATE_GET_ALL_MAGAZINES_FN,
            CREATE_SEARCH_MAGAZINE_BY_NAME_FN
        ])
            await client.rawQuery(query)
    })
    Logger.info("Functions created")

    // Create the stored procedures
    await DatabaseManager.runTransaction(async (client) => {
        for (const query of [
            CREATE_GET_COUNTRY_ID_BY_NAME_PROC,
            CREATE_CREATE_USER_PERSONAL_DOCUMENT_PROC,
            CREATE_REMOVE_USER_PERSONAL_DOCUMENT_PROC,
            CREATE_REPLACE_USER_PERSONAL_DOCUMENT_PROC,
            CREATE_CREATE_PERSON_PROC,
            CREATE_CREATE_USER_EMAIL_PROC,
            CREATE_UPDATE_USER_EMAIL_PROC,
            CREATE_REMOVE_USER_EMAIL_VERIFICATION_TOKEN_BY_USER_EMAIL_ID_PROC,
            CREATE_CREATE_USER_EMAIL_VERIFICATION_TOKEN_PROC,
            CREATE_GET_USER_EMAIL_INFO_BY_USER_ID_PROC,
            CREATE_VERIFY_USER_EMAIL_VERIFICATION_TOKEN_PROC,
            CREATE_REMOVE_USER_RESET_PASSWORD_TOKEN_BY_USER_ID_PROC,
            CREATE_CREATE_USER_RESET_PASSWORD_TOKEN_PROC,
            CREATE_UPDATE_USER_PASSWORD_HASH_PROC,
            CREATE_RESET_USER_PASSWORD_PROC,
            CREATE_CREATE_USER_PROC,
            CREATE_LOG_IN_PROC,
            CREATE_IS_METHOD_ID_VALID_PROC,
            CREATE_IS_PROFILE_ID_VALID_PROC,
            CREATE_GET_USER_ID_BY_USERNAME_PROC,
            CREATE_GET_USER_EMAIL_INFO_BY_USER_EMAIL_PROC,
            CREATE_CREATE_USER_PROFILE_PROC,
            CREATE_REMOVE_USER_PROFILE_PROC,
            CREATE_GET_PERMISSION_ID_BY_PROFILE_ID_METHOD_ID_PROC,
            CREATE_CREATE_PROFILE_PERMISSION_PROC,
            CREATE_REMOVE_PROFILE_PERMISSION_PROC,
            CREATE_CREATE_PROFILE_PROC,
            CREATE_UPDATE_PROFILE_PROC,
            CREATE_REMOVE_PROFILE_PROC,
            CREATE_CREATE_MODULE_PROC,
            CREATE_CREATE_OBJECT_PROC,
            CREATE_CREATE_METHOD_PROC,
            CREATE_REMOVE_ALL_MODULES_PROC,
            CREATE_CREATE_METHOD_WITH_PROFILES_PROC,
            CREATE_GET_MODULE_ID_BY_NAME_PROC,
            CREATE_GET_OBJECT_ID_BY_NAME_PROC,
            CREATE_GET_METHOD_ID_BY_NAME_PROC,
            CREATE_GET_NUMBER_OF_USERS_PROC,
            CREATE_UPDATE_USER_USERNAME_PROC,
            CREATE_UPDATE_USER_BY_ADMIN_PROC,
            CREATE_CREATE_DOCUMENT_PROC,
            CREATE_UPDATE_DOCUMENT_PROC,
            CREATE_REMOVE_DOCUMENT_PROC,
            CREATE_CREATE_DOCUMENT_IMAGE_PROC,
            CREATE_REMOVE_DOCUMENT_IMAGE_PROC,
            CREATE_CREATE_DOCUMENT_LANGUAGE_PROC,
            CREATE_REMOVE_DOCUMENT_LANGUAGE_PROC,
            CREATE_CREATE_POST_PROC,
            CREATE_UPDATE_POST_PROC,
            CREATE_REMOVE_POST_PROC,
            CREATE_CREATE_LOCATION_PROC,
            CREATE_UPDATE_LOCATION_PROC,
            CREATE_REMOVE_LOCATION_PROC,
            CREATE_CREATE_LOCATION_SECTION_PROC,
            CREATE_UPDATE_LOCATION_SECTION_PROC,
            CREATE_REMOVE_LOCATION_SECTION_PROC,
            CREATE_CREATE_DOCUMENT_LOCATION_SECTION_PROC,
            CREATE_REMOVE_DOCUMENT_LOCATION_SECTION_PROC,
            CREATE_CREATE_TOPIC_PROC,
            CREATE_UPDATE_TOPIC_PROC,
            CREATE_REMOVE_TOPIC_PROC,
            CREATE_CREATE_DOCUMENT_TOPIC_PROC,
            CREATE_REMOVE_DOCUMENT_TOPIC_PROC,
            CREATE_CREATE_MAGAZINE_PROC,
            CREATE_UPDATE_MAGAZINE_PROC,
            CREATE_REMOVE_MAGAZINE_PROC,
            CREATE_SET_PROFILE_PERMISSIONS_PROC,
            CREATE_CREATE_PUBLISHER_PROC,
            CREATE_UPDATE_PUBLISHER_PROC,
            CREATE_REMOVE_PUBLISHER_PROC,
            CREATE_CREATE_DOCUMENT_REVIEW_PROC,
            CREATE_UPDATE_DOCUMENT_REVIEW_PROC,
            CREATE_REMOVE_DOCUMENT_REVIEW_PROC,
            CREATE_GET_DOCUMENT_ID_BY_BOOK_ID_PROC,
            CREATE_CREATE_BOOK_PROC,
            CREATE_UPDATE_BOOK_PROC,
            CREATE_CREATE_WORK_PROC,
            CREATE_GET_DOCUMENT_ID_BY_WORK_ID_PROC,
            CREATE_GET_WORK_ID_BY_DOCUMENT_ID_PROC,
            CREATE_UPDATE_WORK_PROC,
            CREATE_CREATE_ARTICLE_PROC,
            CREATE_UPDATE_ARTICLE_PROC,
            CREATE_CREATE_BOOK_COPY_PROC,
            CREATE_UPDATE_BOOK_COPY_PROC,
            CREATE_REMOVE_BOOK_COPY_PROC,
            CREATE_UPDATE_MAGAZINE_ISSUE_PROC,
            CREATE_CREATE_MAGAZINE_ISSUE_PROC,
            CREATE_CREATE_THESIS_PROC,
            CREATE_UPDATE_THESIS_PROC,
            CREATE_GET_USER_DETAILS_BY_USER_ID_PROC,
            CREATE_SET_METHOD_PERMISSIONS_PROC,
            CREATE_CREATE_AUDIT_ENTRY_PROC,
            CREATE_CREATE_ARTICLE_JURY_MEMBER_PROC,
            CREATE_REMOVE_ARTICLE_JURY_MEMBER_PROC,
            CREATE_CREATE_ARTICLE_ANNOTATION_PROC,
            CREATE_UPDATE_ARTICLE_ANNOTATION_PROC,
            CREATE_RESOLVE_ARTICLE_ANNOTATION_PROC,
            CREATE_SET_BOOK_COPY_AS_LOST_PROC,
            CREATE_REGISTER_BOOK_COPY_LOAN_WITH_RESERVATION_PROC,
            CREATE_SET_BOOK_COPY_LOAN_RESERVATION_AS_BORROWED_PROC,
            CREATE_REGISTER_BOOK_COPY_LOAN_WITHOUT_RESERVATION_PROC,
            CREATE_SET_BOOK_COPY_LOAN_AS_RETURNED_PROC,
            CREATE_REMOVE_BOOK_COPY_LOAN_PROC,
            CREATE_SET_BOOK_COPY_LOAN_AS_LOST_PROC,
            CREATE_GET_PERMISSIONS_BY_METHOD_ID_PROC
        ])
            await client.rawQuery(query)
    })
    Logger.info("Stored procedures created")

    // Insert the profiles
    try {
        await DatabaseManager.rawQuery(INSERT_PROFILES)
        Logger.info("Profiles inserted")
    } catch (error) {
        Logger.error(`Error inserting profiles: ${error}`)
    }

    // Insert the countries
    try {
        await DatabaseManager.rawQuery(INSERT_COUNTRIES)
        Logger.info("Countries inserted")
    } catch (error) {
        Logger.error(`Error inserting countries: ${error}`)
    }

    // Insert the languages
    try {
        await DatabaseManager.rawQuery(INSERT_LANGUAGES)
        Logger.info("Languages inserted")
    } catch (error) {
        Logger.error(`Error inserting languages: ${error}`)
    }

    // Get the profiles
    let queryRes = await DatabaseManager.rawQuery(GET_ALL_PROFILES_FN)
    queryRes = queryRes?.rows

    // Create the profiles ID map
    const profilesID = queryRes.reduce((acc, profile) => {
        acc[profile?.name] = profile?.id
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

    // Migrate the root module nested modules
    for (const nestedModuleName of Object.keys(rootModule.nestedModules)) {
        // Get the nested module
        const nestedModule = rootModule.getNestedModule(nestedModuleName)

        // Migrate the nested module
        await migrateModule(profilesID, nestedModule)
    }
}