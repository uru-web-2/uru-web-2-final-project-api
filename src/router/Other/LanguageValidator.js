import {Validate} from "@ralvarezdev/js-joi-parser";
import {SEARCH_LANGUAGE_BY_NAME} from "./LanguageModel.js";

// Validator for the language object
export class LanguageValidator {
    // Validate search language by name
    SearchLanguageByName(req) {
        return Validate(req, SEARCH_LANGUAGE_BY_NAME);
    }
}

// Singleton instance of the LanguageValidator
export default new LanguageValidator();