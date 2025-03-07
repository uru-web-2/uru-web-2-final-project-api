import {Validate} from "@ralvarezdev/js-joi-parser";
import {
    ASSIGN_PROFILE_PERMISSION, GET_METHODS_BY_OBJECT_ID, GET_OBJECTS_BY_MODULE_ID,
    GET_PROFILE_PERMISSIONS_METHODS,
    REVOKE_PROFILE_PERMISSION
} from "./SecurityModel.js";

// Validator for the security object
export class SecurityValidator {
    // Validate assign profile permission
    AssignProfilePermission(req) {
        return Validate(req, ASSIGN_PROFILE_PERMISSION);
    }

    // Validate revoke profile permission
    RevokeProfilePermission(req) {
        return Validate(req, REVOKE_PROFILE_PERMISSION);
    }

    // Validate get profile permissions methods
    GetProfilePermissionsMethods(req) {
        return Validate(req, GET_PROFILE_PERMISSIONS_METHODS);
    }

    // Validate get objects by module ID
    GetObjectsByModuleID(req) {
        return Validate(req, GET_OBJECTS_BY_MODULE_ID);
    }

    // Validate get methods by object ID
    GetMethodsByObjectID(req) {
        return Validate(req, GET_METHODS_BY_OBJECT_ID);
    }
}

// Singleton instance of the SecurityValidator
export default new SecurityValidator();