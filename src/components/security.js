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
import {FailResponseError} from "@ralvarezdev/js-express";
import {Route} from "@ralvarezdev/js-module-permissions";
import {__dirname} from "../router/constants.js";
import Script from "@ralvarezdev/js-reflection";
import {classNameFn, instanceNameFn, scriptNameFn} from "./reflection.js";
import path from "path";

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

        // Get the permissions
        const permissions = await DatabaseManager.rawQuery(GET_PERMISSIONS_FN)

        // Iterate over the permissions
        for (const {id, profile_id:profileID, method_id} of permissions.rows) {
            // Get the method
            const method = this.#methods.get(method_id)
            if (!method)
                throw new Error(`Method ${method_id} not found for permission ${id}`)

            // Add the permission
            this.addPermission(profileID, method)
        }
    }

    // Add a permission
    addPermission(profileID, methodID) {
        // Check if the method exists in the permissions map
        if (!this.#permissions.has(methodID))
            this.#permissions.set(methodID, new Map())

        // Set the permission
        this.#permissions.get(methodID).set(profileID, true)
    }

    // Remove a permission
    removePermission(profileID, methodID) {
        // Check if the method exists in the permissions map
        if (!this.#permissions.has(methodID))
            return

        // Remove the permission
        this.#permissions.get(methodID).delete(profileID)
    }

    // Remove a profile
    removeProfile(profileID) {
        // Iterate over the permissions
        for (const [methodID, profileID] of this.#permissions) {
            // Check if the profile has the permission
            if (this.hasPermission(profileID, methodID))
                this.removePermission(profileID, methodID)
        }
    }

    // Check if a profile has a permission
    hasPermission(profileID, methodID) {
        // Check if the method exists in the permissions map
        if (!this.#permissions.has(methodID))
            return false

        // Check if the profile has the permission
        return this.#permissions.get(methodID).has(profileID)
    }

    // Execute a method
    async executeMethod(modulesNames, objectName, methodName, req) {
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

        // Check if the user has the permission to execute the method
        if (!this.hasPermission(req.session.profileID, method.id))
            throw new FailResponseError(401, {
                session: "You don't have permission to execute this method"
            })

        // Check if the module has the script
        if (!module.getObject(objectName))
        {
            // Create the script name and script path
            const scriptName=scriptNameFn(objectName)
            const scriptPath=path.join(__dirname, scriptName)

            // Create object
            module.createObject(scriptPath, scriptName, classNameFn(scriptPath, scriptName), instanceNameFn(scriptPath, scriptName))
        }

         // Get the class from the object manager
        const Class = await options.object.getClass();


        // Get the script
        const script = this.#scripts.get(scriptPath)

        // Get the class from the object manager
        const Class = await script.getClass();

    // Get the class methods from the object manager
    const ClassMethods = await options.object.getClassMethods();



    // Iterate over the class methods
    for (const classMethodName of Object.keys(ClassMethods)) {
        // Log the class method name
        if (options.logger)
            options.logger.info(`Class method found: ${classMethodName}`);

        // Get the allowed profiles for the method
        const allowedProfiles = GetMetadataProfiles(Class, classMethodName);

        // Log the allowed profiles
        if (options.logger)
            options.logger.info(`Class method '${classMethodName}' has allowed profiles: ${allowedProfiles}`);

        // Create a new method in the object manager
        options.object.createMethod(classMethodName, ...allowedProfiles);
    }


        // Execute the method
        return method.(...args)
    }
}

// Singleton instance of the security component
export default new Security();