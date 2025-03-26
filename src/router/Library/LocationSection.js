import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./LocationSectionValidator.js";
import Service from "./LocationSectionService.js";
import Logger from "../../components/logger.js";

// Location section object for the library module
export class LocationSection {
    // Create a location section
    async CreateLocationSection(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.CreateLocationSection
        );

        // Create the location section
        const locationSectionID = await Service.CreateLocationSection(req, body)

        // Log the creation
        Logger.info(`Created location section ${locationSectionID} with name ${body.name} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Update a location section
    async UpdateLocationSection(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.UpdateLocationSection
        );

        // Update the location section
        await Service.UpdateLocationSection(req, body)

        // Log the update
        Logger.info(`Updated location section ${body.id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Delete a location section
    async DeleteLocationSection(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.DeleteLocationSection
        );

        // Delete the location section
        await Service.DeleteLocationSection(req, body)

        // Log the deletion
        Logger.info(`Deleted location section ${body.id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Get all location sections
    async GetAllLocationSections(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.GetAllLocationSections
        );

        // Get all location sections
        const locationSections = await Service.GetAllLocationSections(req, body)

        // Log the retrieval
        Logger.info(`Retrieved all location sections by user ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({location_sections: locationSections}))
    }

    // Get location sections by location ID
    async GetLocationSectionsByLocationID(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.GetLocationSectionsByLocationID
        );

        // Get location sections by location ID
        const locationSections = await Service.GetLocationSectionsByLocationID(
            req,
            body
        )

        // Log the retrieval
        Logger.info(`Retrieved location sections by location ID ${body.location_id} by user ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({location_sections: locationSections}))
    }

}

// Singleton instance
export default new LocationSection();