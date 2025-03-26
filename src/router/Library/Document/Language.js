import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./LanguageValidator.js";
import Service from "./LanguageService.js";
import Logger from "../../../components/logger.js";

// Language object for the document module
export class Language {
    // Assign document language
    async AssignDocumentLanguage(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.AssignDocumentLanguage
        );

        // Assign the document language
        await Service.AssignDocumentLanguage(req, body)

        // Log the assignment
        Logger.info(`Assigned language ${body.language_id} to document ${body.document_id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Remove document language
    async RemoveDocumentLanguage(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.RemoveDocumentLanguage
        );

        // Revoke the document language
        await Service.RemoveDocumentLanguage(req, body)

        // Log the revocation
        Logger.info(`Removed language ${body.language_id} from document ${body.document_id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Get document languages by document ID
    async GetDocumentLanguagesByDocumentID(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.GetDocumentLanguagesByDocumentID
        );

        // Get the document languages
        const languages = await Service.GetDocumentLanguagesByDocumentID(req,
            body
        )

        // Log the retrieval
        Logger.info(`Retrieved languages for document ${body.document_id} by user ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({languages}))
    }
}

// Singleton instance
export default new Language();