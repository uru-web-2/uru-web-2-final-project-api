import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./MagazineValidator.js";
import Service from "./MagazineService.js";
import Logger from "../../../../components/logger.js";

// Magazine object for the document module
export class Magazine {
    // Creates a magazine
    async CreateMagazine(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.CreateMagazine);

        // Create the magazine
        await Service.CreateMagazine(req, body)

        // Log the creation
        Logger.info(`Created magazine ${body.name} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Updates a magazine
    async UpdateMagazine(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.UpdateMagazine);

        // Update the magazine
        await Service.UpdateMagazine(req, body)

        // Log the update
        Logger.info(`Updated magazine ${body.id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Removes a magazine
    async RemoveMagazine(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.RemoveMagazine);

        // Remove the magazine
        await Service.RemoveMagazine(req, body)

        // Log the removal
        Logger.info(`Removed magazine ${body.id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Gets all magazines
    async GetAllMagazines(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.GetAllMagazines);

        // Get all magazines
        const magazines = await Service.GetAllMagazines(req, body)

        // Log the retrieval
        Logger.info(`Retrieved all magazines by user ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({magazines}))
    }

    // Searches for a magazine by name
    async SearchMagazineByName(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.SearchMagazineByName);

        // Search for the magazine
        const magazines = await Service.SearchMagazineByName(req, body)

        // Log the search
        Logger.info(`Searched for magazine ${body.name} by user ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({magazines}))
    }
}

// Singleton instance
export default new Magazine();