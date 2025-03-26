import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./TopicValidator.js";
import Service from "./TopicService.js";
import Logger from "../../components/logger.js";

// Topic object for the document module
export class Topic {
    // Assign document topic
    async AssignDocumentTopic(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.AssignDocumentTopic);

        // Assign the document topic
        await Service.AssignDocumentTopic(req, body)

        // Log the assignment
        Logger.info(`Assigned document ${body.document_id} to topic ${body.topic_id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Remove document topic
    async RemoveDocumentTopic(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.RemoveDocumentTopic);

        // Revoke the document topic
        await Service.RemoveDocumentTopic(req, body)

        // Log the revocation
        Logger.info(`Removed document ${body.document_id} from topic ${body.topic_id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }
}

// Singleton instance
export default new Topic();