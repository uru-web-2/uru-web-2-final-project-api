import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./UserValidator.js";
import Logger from "../../components/logger.js";
import Service from "./UserService.js";

// User object for the security module
export class User {
    // Assign a profile to a user
    async AssignUserProfile(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.AssignUserProfile);

        // Assign the profile
        const userID = await Service.AssignUserProfile(req, body);

        // Log the assignment
        Logger.info(`Assigning profile ${body.profile_id} to user ${userID}`);

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Revoke a profile from a user
    async RevokeUserProfile(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.RevokeUserProfile);

        // Revoke the profile
        const userID = await Service.RevokeUserProfile(req, body);

        // Log the revocation
        Logger.info(`Revoking profile ${body.profile_id} from user ${userID}`);

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Search a user by username
    async SearchUserByUsername(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.SearchUserByUsername);

        // Search the user
        const user = await Service.SearchUserByUsername(req, body);

        // Log the search
        Logger.info(`Searching user ${body.username}`);

        // Send the response
        res.status(200).json(SuccessJSendBody(user))
    }

    // Create a user
    async CreateUser(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.CreateUser);

        // Create the user
        const userID = await Service.CreateUser(req, body);

        // Log the creation
        Logger.info(`Created user ${userID}`);

        // Send the response
        res.status(201).json(SuccessJSendBody())
    }
}

// Singleton instance
export default new User();