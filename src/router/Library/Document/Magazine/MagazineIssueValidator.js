import {Validate} from "@ralvarezdev/js-joi-parser";
import {
    CREATE_MAGAZINE_ISSUE
} from "./MagazineIssueModel.js";

// Validator for the magazine issue object
export class MagazineIssueValidator {
    // Validate create magazine issue
    CreateMagazineIssue(req) {
        return Validate(req, CREATE_MAGAZINE_ISSUE);
    }
}

// Singleton instance of the MagazineIssueValidator
export default new MagazineIssueValidator();