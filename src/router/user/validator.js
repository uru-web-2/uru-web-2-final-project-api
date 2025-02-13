import {Validate} from "@ralvarezdev/js-joi-parser"
import {ADD_USER_PROFILE_PROC} from "../../database/model/storedProcedures.js";

// Validator for the user route
export class Validator {
    // Validate the add profile request
    AddProfile(req) {
        return Validate(req, ADD_USER_PROFILE_PROC)
    }
}

// Export an instance of the validator
export const VALIDATOR = new Validator()