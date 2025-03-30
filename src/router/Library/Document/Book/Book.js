import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./BookValidator.js";
import Service from "./BookService.js";
import Logger from "../../../../components/logger.js";

// Book object for the book module
export class Book {
    // Creates a book
    async CreateBook(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.CreateBook);

        // Create the book
        const bookID = await Service.CreateBook(req, body);

        // Log the creation
        Logger.info(`Created book ${bookID} by admin ${req.session.userID}`);

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }
}

// Singleton instance
export default new Book();