import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./LocationSectionValidator.js";
import Service from "./LocationSectionService.js";
import Logger from "../../components/logger.js";

// Location section object for the library module
export class LocationSection {
    // Createx a location section
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

    // Updates a location section
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

    // Removes a location section
    async RemoveLocationSection(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.RemoveLocationSection
        );

        // Remove the location section
        await Service.RemoveLocationSection(req, body)

        // Log the removal
        Logger.info(`Removed location section ${body.id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Gets all location sections
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

    // Gets location sections by location ID
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