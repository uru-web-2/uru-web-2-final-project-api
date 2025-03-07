import {
    NewRootModuleManager
} from "@ralvarezdev/js-module-permissions/permissions/moduleManager.js";
import DatabaseManager from './database.js'
import {
    GET_ALL_METHODS_FN,
    GET_ALL_MODULES_FN,
    GET_ALL_OBJECTS_FN,
    GET_ALL_PERMISSIONS_FN, GET_ALL_PROFILES_FN
} from "../database/model/functions.js";
import {FailResponseError} from "@ralvarezdev/js-express";
import {__dirname} from "../router/constants.js";
import {
    classNameFn,
    instanceNameFn,
    printModule,
    scriptNameFn
} from "./reflection.js";
import path from "path";
import Session from "./session.js";

// Security component
export class Security {
    #rootModule
    #modules = new Map()
    #objects = new Map()
    #methods = new Map()
    #methodsIDsByNames= new Map()
    #profiles = new Map()
    #permissions = new Map()

    constructor() {
        // Create the root module
        this.#rootModule = NewRootModuleManager()
    }

    // Load the security configuration
    async load() {
        // Get the profiles
        const profiles = await DatabaseManager.rawQuery(GET_ALL_PROFILES_FN)

        // Iterate over the profiles
        for (const {profile_id: id, profile_name: name} of profiles.rows)
            this.#profiles.set(id, name)

        // Get the modules
        const queryRes = await DatabaseManager.rawQuery(GET_ALL_MODULES_FN)

        // Iterate over the modules
        for (const {id, name, parent_module_id} of queryRes.rows) {
            // Check if the module has a parent
            if (parent_module_id) {
                // Get the parent module
                const parentModule = this.getModule(parent_module_id)

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
        const objects = await DatabaseManager.rawQuery(GET_ALL_OBJECTS_FN)

        // Iterate over the objects
        for (const {id, name, module_id} of objects.rows) {
            // Get the module
            const module = this.getModule(module_id)

            // Create the script name and script path
            const scriptName = scriptNameFn(name)
            const scriptPath = path.join(__dirname, module.name, scriptName)

            // Create the object
            const object = module.createObject(scriptPath, scriptName, classNameFn, instanceNameFn)
            this.#objects.set(id, object)
        }

        // Get the permissions
        const permissions = await DatabaseManager.rawQuery(GET_ALL_PERMISSIONS_FN)

        // Iterate over the permissions
        for (const {profile_id, method_id} of permissions.rows)
            // Add the permission
            this.addPermission(profile_id, method_id)

        // Get the methods
        const methods = await DatabaseManager.rawQuery(GET_ALL_METHODS_FN)

        // Iterate over the methods
        for (const {id, name, object_id} of methods.rows) {
            // Get the object
            const object = this.getObject(object_id)

            // Create the method
            const method = object.createMethod(name, ...this.#permissions.get(id))
            this.#methods.set(id, method)
            this.#methodsIDsByNames.set(name, id)
        }

        // Print the root module
        printModule(this.#rootModule)
    }

    // Get a module
    getModule(moduleID) {
        // Get the module
        const module = this.#modules.get(moduleID)
        if (!module)
            throw new Error(`Module ${moduleID} not found`)
        return module
    }

    // Get an object
    getObject(objectID) {
        // Get the object
        const object = this.#objects.get(objectID)
        if (!object)
            throw new Error(`Object ${objectID} not found`)
        return object
    }

    // Add a permission
    addPermission(profileID, methodID) {
        // Check if the method exists in the permissions map
        if (!this.#permissions.has(methodID))
            this.#permissions.set(methodID, [])

        // Set the permission
        this.#permissions.set(methodID, [...this.#permissions.get(methodID), profileID])
    }

    // Remove a permission
    removePermission(profileID, methodID) {
        // Check if the method exists in the permissions map
        if (!this.#permissions.has(methodID))
            return

        // Remove the permission
        this.#permissions.get(methodID).filter(permissionProfileID => permissionProfileID !== profileID)
    }

    // Add a profile
    addProfile(profileID, profileName) {
        // Check if the profile exists
        if (this.hasProfile(profileID))
            throw new Error(`Profile ${profileID} already exists`)

        // Set the profile
        this.#profiles.set(profileID, profileName)
    }

    // Update profile name
    updateProfile(profileID, profileName) {
        // Check if the profile exists
        if (!this.hasProfile(profileID))
            throw new Error(`Profile ${profileID} not found`)

        // Set the profile
        this.#profiles.set(profileID, profileName)
    }

    // Remove a profile
    removeProfile(profileID) {
        if (!this.hasProfile(profileID))
            throw new Error(`Profile ${profileID} not found`)

        // Iterate over the permissions
        for (const [methodID,] of this.#permissions) {
            // Check if the profile has the permission
            if (this.hasPermission(profileID, methodID))
                this.removePermission(profileID, methodID)
        }

        // Remove the profile
        this.#profiles.delete(profileID)
    }

    // Check if a profile exists
    hasProfile(profileID) {
        return this.#profiles.has(profileID)
    }

    // Check if a profile has a permission
    hasPermission(profileID, methodID) {
        // Check if the method exists in the permissions map
        if (!this.#permissions.has(methodID))
            return false

        // Check if the profile has the permission
        return this.#permissions.get(methodID).includes(profileID)
    }

    // Execute a method
    async executeMethod(modulesNames, objectName, methodName, req, res) {
        // Get the module
        let module = this.#rootModule
        let parentModuleName = 'router'

        // Iterate over the modules
        for (const moduleName of modulesNames) {
            // Get the module
            module = module.getNestedModule(moduleName)
            if (!module)
                throw new Error(`Module ${moduleName} not found in ${parentModuleName}`)

            // Update the parent module name
            parentModuleName = moduleName
        }

        // Get the object
        const object = module.getObject(objectName)
        if (!object)
            throw new Error(`Object ${objectName} not found in ${parentModuleName}`)

        // Get the method
        const method = object.getMethod(methodName)
        if (!method)
            throw new Error(`Method ${methodName} not found in ${objectName}`)

        // Check if the profile exists
        const profileID = req.session.profileID
        if (!this.hasProfile(profileID)) {
            // Destroy the session
            Session.destroy(req)

            throw new FailResponseError(401, {
                session: "Profile not found. Session destroyed. Log in again"
            })
        }

        // Check if the user has the permission to execute the method
        if (!this.hasPermission(profileID, this.#methodsIDsByNames.get(methodName)))
            throw new FailResponseError(401, {
                session: "You don't have permission to execute this method"
            })

        // Execute the method
        return await (await object.getInstanceMethod(methodName))(req, res)
    }
}

// Singleton instance of the security component
export default new Security();