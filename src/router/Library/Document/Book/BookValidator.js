import {Validate} from "@ralvarezdev/js-joi-parser";
import {CREATE_BOOK} from "./BookModel.js";

// Validator for the book object
export class BookValidator {
    // Validate create book
    CreateBook(req) {
        return Validate(req, CREATE_BOOK);
    }
}

// Singleton instance of the BookValidator
export default new BookValidator();