import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./AuthorValidator.js";
import Service from "./AuthorService.js";
import Logger from "../../../components/logger.js";

// Author object for the document module
export class Author {
    // Assign document author
    async AssignDocumentAuthor(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.AssignDocumentAuthor);

        // Assign the document author
        await Service.AssignDocumentAuthor(req, body)

        // Log the assignment
        Logger.info(`Assigned author ${body.author_id} to document ${body.document_id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Remove document author
    async RemoveDocumentAuthor(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.RemoveDocumentAuthor);

        // Revoke the document author
        await Service.RemoveDocumentAuthor(req, body)

        // Log the revocation
        Logger.info(`Removed author ${body.author_id} from document ${body.document_id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Get document authors by document ID
    async GetDocumentAuthorsByDocumentID(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.GetDocumentAuthorsByDocumentID
        );

        // Get the document authors
        const authors = await Service.GetDocumentAuthorsByDocumentID(req, body)

        // Log the retrieval
        Logger.info(`Retrieved authors for document ${body.document_id} by user ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({authors}))
    }
}

// Singleton instance
export default new Author();