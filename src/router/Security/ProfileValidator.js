import {Validate} from "@ralvarezdev/js-joi-parser";
import {
    CREATE_PROFILE,
    REMOVE_PROFILE,
    SEARCH_PROFILE_BY_NAME,
    UPDATE_PROFILE
} from "./ProfileModel.js";

// Validator for the profile object
export class ProfileValidator {
    // Validate create profile
    CreateProfile(req) {
        return Validate(req, CREATE_PROFILE);
    }

    // Validate update profile
    UpdateProfile(req) {
        return Validate(req, UPDATE_PROFILE);
    }

    // Validate remove profile
    RemoveProfile(req) {
        return Validate(req, REMOVE_PROFILE);
    }

    // Validate search profile by name
    SearchProfileByName(req) {
        return Validate(req, SEARCH_PROFILE_BY_NAME);
    }
}

// Singleton instance of the ProfileValidator
export default new ProfileValidator();