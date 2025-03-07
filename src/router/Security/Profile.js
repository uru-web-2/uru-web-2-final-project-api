import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./ProfileValidator.js";
import Logger from "../../components/Logger.js";
import Service from "./ProfileService.js";

// Profile object for the security module
export class Profile {
    // Assign a permission to a profile
    async AssignProfilePermission(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.AssignProfilePermission);

        // Assign the permission
        const permissionID = await Service.AssignProfilePermission(req, body)

        // Log the assignment
        Logger.info(`Assigned permission ${permissionID} to profile ${body.profile_id} to method ${body.method_id}`)

        // Send the response
        res.status(201).json(SuccessJSendBody())
    }

    // Revoke a permission from a profile
    async RevokeProfilePermission(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.RevokeProfilePermission);

        // Revoke the permission
        const permissionID = await Service.RevokeProfilePermission(req, body)

        // Log the revocation
        Logger.info(`Revoked permission ${permissionID} from profile ${body.profile_id} to method ${body.method_id}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

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

    // Get the methods IDs and names from the permissions of a profile
    async GetProfilePermissionsMethods(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.GetProfilePermissionsMethods);

        // Get the methods
        const methods = await Service.GetProfilePermissionsMethods(req, body)

        // Log the request
        Logger.info(`Getting methods from permissions of profile ${body.id}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({methods}))
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