import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./LocationValidator.js";
import Service from "./LocationService.js";
import Logger from "../../components/logger.js";

// Location object for the library module
export class Location {
    // Creates a location
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

    // Updates a location
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

    // Removes a location
    async RemoveLocation(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.RemoveLocation);

        // Removes the location
        await Service.RemoveLocation(req, body)

        // Log the removal
        Logger.info(`Removed location ${body.id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Gets all locations
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