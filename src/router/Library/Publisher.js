import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./PublisherValidator.js";
import Service from "./PublisherService.js";
import Logger from "../../components/logger.js";

// Publisher object for the document module
export class Publisher {
    // Create a publisher
    async CreatePublisher(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.CreatePublisher);

        // Create the publisher
        const publisherID = await Service.CreatePublisher(req, body)

        // Log the creation
        Logger.info(`Created publisher ${publisherID} with name ${body.name} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Update a publisher
    async UpdatePublisher(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.UpdatePublisher);

        // Update the publisher
        await Service.UpdatePublisher(req, body)

        // Log the update
        Logger.info(`Updated publisher ${body.id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Delete a publisher
    async DeletePublisher(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.DeletePublisher);

        // Delete the publisher
        await Service.DeletePublisher(req, body)

        // Log the deletion
        Logger.info(`Deleted publisher ${body.id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Get all publishers
    async GetAllPublishers(req, res) {
        // Get all publishers
        const publishers = await Service.GetAllPublishers(req)

        // Log the retrieval
        Logger.info(`Retrieved all publishers by user ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({publishers}))
    }

    // Search publisher by name
    async SearchPublisherByName(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.SearchPublisherByName
        );

        // Search the publisher
        const publishers = await Service.SearchPublisherByName(req, body)

        // Log the search
        Logger.info(`Searched publisher by name ${body.name} by user ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({publishers}))
    }
}

// Singleton instance
export default new Publisher();