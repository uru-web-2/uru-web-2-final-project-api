import DeepFreeze from "@ralvarezdev/js-deep-freeze";

// Root module manager
export let ROOT_MODULE_MANAGER = null

// Map with the modules
const MODULES = new Map()

// Map with the objects
const OBJECTS = new Map()

// Map with the methods
const METHODS = new Map()

// Map with the permissions
const PERMISSIONS = new Map()

// Default script name
export const DEFAULT_SCRIPT_NAME = "controller.js"

// Default object class name
export const DEFAULT_OBJECT_CLASS_NAME = "Controller"

// Default object instance name
export const DEFAULT_OBJECT_INSTANCE_NAME = "CONTROLLER"

    // Profiles
    export const PROFILES = DeepFreeze({
        GUEST: {NAME:'guest'},
        STUDENT: {NAME:'student'},
        TEACHER: {NAME:'teacher'},
        LIBRARIAN: {NAME:'librarian'},
        ADMIN: {NAME:'admin'},
        SUPERADMIN: {NAME:'superadmin'},
        DEVELOPER: {NAME:'developer'}
    });