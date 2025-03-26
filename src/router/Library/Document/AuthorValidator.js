import {Validate} from "@ralvarezdev/js-joi-parser";
import {
    ASSIGN_DOCUMENT_AUTHOR, GET_DOCUMENT_AUTHORS_BY_DOCUMENT_ID,
    REMOVE_DOCUMENT_AUTHOR,
} from "./AuthorModel.js";

// Validator for the author object
export class AuthorValidator {
    // Validate assign document author
    AssignDocumentAuthor(req) {
        return Validate(req, ASSIGN_DOCUMENT_AUTHOR);
    }

    // Validate remove document author
    RemoveDocumentAuthor(req) {
        return Validate(req, REMOVE_DOCUMENT_AUTHOR);
    }

    // Validate get document authors by document ID
    GetDocumentAuthorsByDocumentID(req) {
        return Validate(req, GET_DOCUMENT_AUTHORS_BY_DOCUMENT_ID);
    }
}

// Singleton instance of the AuthorValidator
export default new AuthorValidator();