import {Validate} from "@ralvarezdev/js-joi-parser";
import {
    ASSIGN_PROFILE_PERMISSION,
    CREATE_PROFILE,
    DELETE_PROFILE,
    GET_PROFILE_PERMISSIONS_METHODS, REVOKE_PROFILE_PERMISSION, UPDATE_PROFILE
} from "./ProfileModel.js";

// Validator for the profile object
export class ProfileValidator{
    // Validate assign profile permission
    AssignProfilePermission(req){
        Validate(req, ASSIGN_PROFILE_PERMISSION);
    }

    // Validate revoke profile permission
    RevokeProfilePermission(req){
        Validate(req, REVOKE_PROFILE_PERMISSION);
    }

    // Validate create profile
    CreateProfile(req){
        Validate(req, CREATE_PROFILE);
    }

    // Validate update profile
    UpdateProfile(req){
        Validate(req, UPDATE_PROFILE);
    }

    // Validate delete profile
    DeleteProfile(req){
        Validate(req, DELETE_PROFILE);
    }

    // Validate get profile permissions methods
    GetProfilePermissionsMethods(req){
        Validate(req, GET_PROFILE_PERMISSIONS_METHODS);
    }
}

// Singleton instance of the ProfileValidator
export default new ProfileValidator();