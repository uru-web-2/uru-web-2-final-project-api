import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./ProfileValidator.js";
import Logger from "../../components/Logger.js";
import Service from "./ProfileService.js";

// Profile object for the security module
export class Profile {
    // Create a profile
    async CreateProfile(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.CreateProfile);

        // Create the profile
        const profileID = await Service.CreateProfile(req, body)

        // Log the creation
        Logger.info(`Created profile ${profileID} with name ${body.name}`)

        // Send the response
        res.status(201).json(SuccessJSendBody())
    }

    // Update a profile
    async UpdateProfile(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.UpdateProfile);

        // Update the profile
        await Service.UpdateProfile(req, body)

        // Log the update
        Logger.info(`Updated profile ${body.id} name to ${body.name}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Delete a profile
    async DeleteProfile(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.DeleteProfile);

        // Delete the profile
        await Service.DeleteProfile(req, body)

        // Log the deletion
        Logger.info(`Deleted profile ${body.id}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Search a profile by name
    async SearchProfileByName(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.SearchProfileByName);

        // Search the profile
        const profiles = await Service.SearchProfileByName(req, body)

        // Log the request
        Logger.info(`Searching profile by name ${body.name}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({profiles}))
    }

    // Get all profiles
    async GetAllProfiles(req, res) {
        // Get all the profiles
        const profiles = await Service.GetAllProfiles(req);

        // Log the creation
        Logger.info(`Fetching all profiles`);

        // Send the response
        res.status(200).json(SuccessJSendBody(profiles))
    }
}

// Singleton instance
export default new Profile();