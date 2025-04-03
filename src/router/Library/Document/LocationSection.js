import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./LocationSectionValidator.js";
import Service from "./LocationSectionService.js";
import Logger from "../../../components/logger.js";

// LocationSection object for the document module
export class LocationSection {
    // Creates a document location section
    async CreateDocumentLocationSection(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.CreateDocumentLocationSection
        );

        // Create the document location section
        await Service.CreateDocumentLocationSection(req, body)

        // Log the creation
        Logger.info(`Created location section ${body.location_section_id} to document ${body.document_id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Removes a document location section
    async RemoveDocumentLocationSection(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.RemoveDocumentLocationSection
        );

        // Remove the document location section
        await Service.RemoveDocumentLocationSection(req, body)

        // Log the removal
        Logger.info(`Removed location section ${body.location_section_id} from document ${body.document_id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Gets a document location sections by document ID
    async GetDocumentLocationSectionsByDocumentID(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.GetDocumentLocationSectionsByDocumentID
        );

        // Get the document location sections
        const locationSections = await Service.GetDocumentLocationSectionsByDocumentID(
            req,
            body
        )

        // Log the retrieval
        Logger.info(`Retrieved location sections for document ${body.document_id} by user ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({locationSections}))
    }
}

// Singleton instance
export default new LocationSection();