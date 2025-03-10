import {Validate} from "@ralvarezdev/js-joi-parser";
import {
    CREATE_USER,
    GET_USER_DETAILS_BY_USER_ID,
    SEARCH_USER_BY_USERNAME
} from "./UserModel.js";
import {FieldFailError} from "@ralvarezdev/js-express";

// Validator for the user object
export class UserValidator {
    // Validate search user by username
    SearchUserByUsername(req) {
        return Validate(req, SEARCH_USER_BY_USERNAME);
    }

    // Validate create user
    CreateUser(req) {
         const [validatedBody, isBodyValid]=Validate(req, CREATE_USER);

         // Check if the username contains whitespaces
        if (isBodyValid&&validatedBody.username.includes(" "))
            throw new FieldFailError(400, "username", "username cannot contain spaces")

        return [validatedBody, isBodyValid]
    }

    // Validate get user details by user ID
    GetUserDetailsByUserID(req) {
        return Validate(req, GET_USER_DETAILS_BY_USER_ID);
    }
}

// Singleton instance of the UserValidator
export default new UserValidator();