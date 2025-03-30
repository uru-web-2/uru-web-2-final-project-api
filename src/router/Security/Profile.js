import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./ProfileValidator.js";
import Logger from "../../components/Logger.js";
import Service from "./ProfileService.js";

// Profile object for the security module
export class Profile {
    // Creates a profile
    async CreateProfile(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.CreateProfile);

        // Create the profile
        const profileID = await Service.CreateProfile(req, body)

        // Log the creation
        Logger.info(`Created profile ${profileID} with name ${body.name}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Updates a profile
    async UpdateProfile(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.UpdateProfile);

        // Update the profile
        await Service.UpdateProfile(req, body)

        // Log the update
        Logger.info(`Updated profile ${body.id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Remove a profile
    async RemoveProfile(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.RemoveProfile);

        // Remove the profile
        await Service.RemoveProfile(req, body)

        // Log the removal
        Logger.info(`Removed profile ${body.id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Searches a profile by name
    async SearchProfileByName(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.SearchProfileByName);

        // Search the profile
        const profiles = await Service.SearchProfileByName(req, body)

        // Log the search
        Logger.info(`Searched profile by name ${body.name} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({profiles}))
    }

    // Gets all profiles
    async GetAllProfiles(req, res) {
        // Get all the profiles
        const profiles = await Service.GetAllProfiles(req);

        // Log the retrieval
        Logger.info(`Retrieved all profiles by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody(profiles))
    }
}

// Singleton instance
export default new Profile();