import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./TopicValidator.js";
import Service from "./TopicService.js";
import Logger from "../../components/logger.js";

// Topic object for the library module
export class Topic {
    // Creates a topic
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

    // Updates a topic
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

    // Removes a topic
    async RemoveTopic(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.RemoveTopic);

        // Delete the topic
        await Service.RemoveTopic(req, body)

        // Log the removal
        Logger.info(`Removed topic ${body.id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Gets all topics
    async GetAllTopics(req, res) {
        // Get all topics
        const topics = await Service.GetAllTopics(req)

        // Log the retrieval
        Logger.info(`Retrieved all topics by user ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({topics}))
    }

    // Searches topic by name
    async SearchTopicByName(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.SearchTopicByName);

        // Search the topic
        const topics = await Service.SearchTopicByName(req, body)

        // Log the search
        Logger.info(`Searched topic by name ${body.name} by user ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({topics}))
    }
}

// Singleton instance
export default new Topic();