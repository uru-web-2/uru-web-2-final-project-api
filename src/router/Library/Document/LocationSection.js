import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./LocationSectionValidator.js";
import Service from "./LocationSectionService.js";
import Logger from "../../../components/logger.js";

// LocationSection object for the document module
export class LocationSection {
    // Assign document location section
    async AssignDocumentLocationSection(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.AssignDocumentLocationSection);

        // Assign the document location section
        await Service.AssignDocumentLocationSection(req, body)

        // Log the assignment
        Logger.info(`Assigned location section ${body.location_section_id} to document ${body.document_id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Remove document location section
    async RemoveDocumentLocationSection(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.RemoveDocumentLocationSection);

        // Revoke the document location section
        await Service.RemoveDocumentLocationSection(req, body)

        // Log the revocation
        Logger.info(`Removed location section ${body.location_section_id} from document ${body.document_id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Get document location sections by document ID
    async GetDocumentLocationSectionsByDocumentID(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.GetDocumentLocationSectionsByDocumentID
        );

        // Get the document location sections
        const locationSections = await Service.GetDocumentLocationSectionsByDocumentID(req, body)

        // Log the retrieval
        Logger.info(`Retrieved location sections for document ${body.document_id} by user ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({locationSections}))
    }
}

// Singleton instance
export default new LocationSection();