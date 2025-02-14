import {Validate} from "@ralvarezdev/js-joi-parser";
import {ASSIGN_USER_PROFILE, REVOKE_USER_PROFILE} from "./UserModel.js";

// Validator for the user object
export class UserValidator{
    // Validate assign user profile
    AssignUserProfile(req){
        Validate(req, ASSIGN_USER_PROFILE);
    }

    // Validate revoke user profile
    RevokeUserProfile(req){
        Validate(req, REVOKE_USER_PROFILE);
    }
}

// Singleton instance of the UserValidator
export default new UserValidator();