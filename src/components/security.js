import DeepFreeze from "@ralvarezdev/js-deep-freeze";
import {
    NewRootModuleManager
} from "@ralvarezdev/js-module-permissions/permissions/moduleManager.js";
import DatabaseManager from './database.js'
import {
    GET_METHODS_FN,
    GET_MODULES_FN,
    GET_OBJECTS_FN, GET_PERMISSIONS_FN, GET_PROFILES_FN
} from "../database/model/functions.js";
import * as constants from "node:constants";

// Profiles names
export const PROFILES_NAME = DeepFreeze({
    GUEST: 'guest',
    STUDENT: 'student',
    TEACHER: 'teacher',
    LIBRARIAN: 'librarian',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super admin',
    DEVELOPER: 'developer'
});

// Security component
export class Security {
    #rootModule
    #modules = new Map()
    #objects = new Map()
    #methods = new Map()
    #profilesID = new Map()
    #permissions = new Map()

    constructor() {
        // Create the root module
        this.#rootModule = NewRootModuleManager()
    }

    // Load the security configuration
    async load() {
        // Get the modules
        const  queryRes= await DatabaseManager.rawQuery(GET_MODULES_FN)

        // Iterate over the modules
        for (const {id,name , parent_module_id} of queryRes.rows) {
            // Check if the module has a parent
            if (parent_module_id) {
                // Get the parent module
                const parentModule = this.#modules.get(parent_module_id)
                if (!parentModule)
                    throw new Error(`Parent module ${parent_module_id} not found for module ${id}`)

                // Create the module
                const moduleManager = parentModule.createNestedModule(name)
                this.#modules.set(id, moduleManager)
            } else {
                // Create the module
                const moduleManager = this.#rootModule.createNestedModule(name)
                this.#modules.set(id, moduleManager)
            }
        }

        // Get the objects
        const objects = await DatabaseManager.rawQuery(GET_OBJECTS_FN)

        // Iterate over the objects
        for (const {id, name, module_id} of objects.rows) {
            // Get the module
            const module = this.#modules.get(module_id)
            if (!module)
                throw new Error(`Module ${module_id} not found for object ${id}`)

            // Create the object
            const object = module.createObject(name)
            this.#objects.set(id, object)
        }

        // Get the methods
        const methods = await DatabaseManager.rawQuery(GET_METHODS_FN)

        // Iterate over the methods
        for (const {id, name, object_id} of methods.rows) {
            // Get the object
            const object = this.#objects.get(object_id)
            if (!object)
                throw new Error(`Object ${object_id} not found for method ${id}`)

            // Create the method
            const method = object.createMethod(name)
            this.#methods.set(id, method)
        }

        // Get the profiles ID
        const profiles = await DatabaseManager.rawQuery(GET_PROFILES_FN)

        // Iterate over the profiles
        for (const {id, name} of profiles.rows) {
            // Set the profile ID
            this.#profilesID.set(name, id)
        }

        // Get the permissions
        const permissions = await DatabaseManager.rawQuery(GET_PERMISSIONS_FN)

        // Iterate over the permissions
        for (const {id, profile_id, method_id} of permissions.rows) {
            // Get the profile ID
            const profileID = this.#profilesID.get(profile_id)
            if (!profileID)
                throw new Error(`Profile ${profile_id} not found for permission ${id}`)

            // Get the method
            const method = this.#methods.get(method_id)
            if (!method)
                throw new Error(`Method ${method_id} not found for permission ${id}`)

            // Check if the method exists in the permissions map
            if (!this.#permissions.has(method_id))
                this.#permissions.set(method, new Map())

            // Set the permission
            this.#permissions.get(method).set(profileID, true)
        }
    }
}

// Singleton instance of the security component
export default new Security();