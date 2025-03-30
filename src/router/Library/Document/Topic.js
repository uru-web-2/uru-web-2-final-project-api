import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./TopicValidator.js";
import Service from "./TopicService.js";
import Logger from "../../../components/logger.js";

// Topic object for the document module
export class Topic {
    // Creates a document topic
    async CreateDocumentTopic(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.CreateDocumentTopic);

        // Create the document topic
        await Service.CreateDocumentTopic(req, body)

        // Log the creation
        Logger.info(`Assigned topic ${body.topic_id} to document ${body.document_id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Removes a document topic
    async RemoveDocumentTopic(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.RemoveDocumentTopic);

        // Remove the document topic
        await Service.RemoveDocumentTopic(req, body)

        // Log the removal
        Logger.info(`Removed topic ${body.topic_id} from document ${body.document_id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Gets a document topics by document ID
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