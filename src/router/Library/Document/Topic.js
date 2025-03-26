import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./TopicValidator.js";
import Service from "./TopicService.js";
import Logger from "../../../components/logger.js";

// Topic object for the document module
export class Topic {
    // Assign document topic
    async AssignDocumentTopic(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.AssignDocumentTopic);

        // Assign the document topic
        await Service.AssignDocumentTopic(req, body)

        // Log the assignment
        Logger.info(`Assigned topic ${body.topic_id} to document ${body.document_id} by admin ${req.session.userID}`)

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
        Logger.info(`Removed topic ${body.topic_id} from document ${body.document_id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Get document topics by document ID
    async GetDocumentTopicsByDocumentID(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.GetDocumentTopicsByDocumentID
        );

        // Get the document topics
        const topics = await Service.GetDocumentTopicsByDocumentID(req, body)

        // Log the retrieval
        Logger.info(`Retrieved topics for document ${body.document_id} by user ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({topics}))
    }
}

// Singleton instance
export default new Topic();