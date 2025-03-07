import {Validate} from "@ralvarezdev/js-joi-parser";
import {ASSIGN_USER_PROFILE, CREATE_USER, REVOKE_USER_PROFILE, SEARCH_USER_BY_USERNAME} from "./UserModel.js";
import {FieldFailError} from "@ralvarezdev/js-express";

// Validator for the user object
export class UserValidator {
    // Validate assign user profile
    AssignUserProfile(req) {
        return Validate(req, ASSIGN_USER_PROFILE);
    }

    // Validate revoke user profile
    RevokeUserProfile(req) {
        return Validate(req, REVOKE_USER_PROFILE);
    }

    // Validate search user by username
    SearchUserByUsername(req) {
        return Validate(req, SEARCH_USER_BY_USERNAME);
    }

    // Validate create user
    CreateUser(req) {
         const validate=Validate(req, CREATE_USER);

         // Check if the username contains whitespaces
        if (body.username.includes(" "))
            throw new FieldFailError(400, "username", "username cannot contain spaces")

        return validate;
    }
}

// Singleton instance of the UserValidator
export default new UserValidator();