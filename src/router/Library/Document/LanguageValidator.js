import {Validate} from "@ralvarezdev/js-joi-parser";
import {
    CREATE_DOCUMENT_LANGUAGE,
    GET_DOCUMENT_LANGUAGES_BY_DOCUMENT_ID,
    REMOVE_DOCUMENT_LANGUAGE,
} from "./LanguageModel.js";

// Validator for the language object
export class LanguageValidator {
    // Validate create document language
    CreateDocumentLanguage(req) {
        return Validate(req, CREATE_DOCUMENT_LANGUAGE);
    }

    // Validate remove document language
    RemoveDocumentLanguage(req) {
        return Validate(req, REMOVE_DOCUMENT_LANGUAGE);
    }

    // Validate get document languages by document ID
    GetDocumentLanguagesByDocumentID(req) {
        return Validate(req, GET_DOCUMENT_LANGUAGES_BY_DOCUMENT_ID);
    }
}

// Singleton instance of the LanguageValidator
export default new LanguageValidator();