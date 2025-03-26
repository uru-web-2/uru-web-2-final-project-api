import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./LocationValidator.js";
import Service from "./LocationService.js";
import Logger from "../../components/logger.js";

// Location object for the library module
export class Location {
    // Create a location
    async CreateLocation(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.CreateLocation);

        // Create the location
        const locationID = await Service.CreateLocation(req, body)

        // Log the creation
        Logger.info(`Created location ${locationID} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Update a location
    async UpdateLocation(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.UpdateLocation);

        // Update the location
        await Service.UpdateLocation(req, body)

        // Log the update
        Logger.info(`Updated location ${body.id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Delete a location
    async DeleteLocation(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.DeleteLocation);

        // Delete the location
        await Service.DeleteLocation(req, body)

        // Log the deletion
        Logger.info(`Deleted location ${body.id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Get all locations
    async GetAllLocations(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.GetAllLocations);

        // Get all locations
        const locations = await Service.GetAllLocations(req, body)

        // Log the retrieval
        Logger.info(`Retrieved all locations by user ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({locations}))
    }
}

// Singleton instance
export default new Location();