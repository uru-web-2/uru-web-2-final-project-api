import {Validate} from "@ralvarezdev/js-joi-parser";
import {CREATE_THESIS} from "./ThesisModel.js";

// Validator for the thesis object
export class ThesisValidator {
    // Validate create thesis
    CreateThesis(req) {
        return Validate(req, CREATE_THESIS);
    }
}

// Singleton instance of the ThesisValidator
export default new ThesisValidator();