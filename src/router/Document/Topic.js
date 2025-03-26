import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./TopicValidator.js";
import Service from "./TopicService.js";
import Logger from "../../components/logger.js";

// Topic object for the document module
export class Topic {
    // Create a topic
    async CreateTopic(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.CreateTopic);

        // Create the topic
        const topicID = await Service.CreateTopic(req, body)

        // Log the creation
        Logger.info(`Created topic ${topicID} with name ${body.name} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Update a topic
    async UpdateTopic(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.UpdateTopic);

        // Update the topic
        await Service.UpdateTopic(req, body)

        // Log the update
        Logger.info(`Updated topic ${body.id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Delete a topic
    async DeleteTopic(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.DeleteTopic);

        // Delete the topic
        await Service.DeleteTopic(req, body)

        // Log the deletion
        Logger.info(`Deleted topic ${body.id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Get all topics
    async GetAllTopics(req, res) {
        // Get all topics
        const topics = await Service.GetAllTopics(req)

        // Log the retrieval
        Logger.info(`Retrieved all topics by user ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody(topics))
    }

    // Search topic by name
    async SearchTopicByName(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.SearchTopicByName);

        // Search the topic
        const topics = await Service.SearchTopicByName(req, body)

        // Log the search
        Logger.info(`Searched topic by name ${body.name} by user ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody(topics))
    }

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