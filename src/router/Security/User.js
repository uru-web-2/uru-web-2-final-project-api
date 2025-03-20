import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./UserValidator.js";
import Logger from "../../components/logger.js";
import Service from "./UserService.js";

// User object for the security module
export class User {
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

    // Get all users with pagination
    async GetAllUsers(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.GetAllUsers);

        // Get all the users with pagination
        const users = await Service.GetAllUsers(req, body);

        // Log the creation
        Logger.info(`Fetching all users`);

        // Send the response
        res.status(200).json(SuccessJSendBody(users))
    }

    // Get the user details by users ID
    async GetUserDetailsByUserID(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.GetUserDetailsByUserID
        );

        // Get all the users with pagination
        const userDetails = await Service.GetUserDetailsByUserID(
            req,
            body
        );

        // Log the creation
        Logger.info(`Fetching all users`);

        // Send the response
        res.status(200).json(SuccessJSendBody(userDetails))
    }

    // Update a user by admin
    async UpdateUserByAdmin(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.UpdateUserByAdmin);

        // Update the user by admin
        await Service.UpdateUserByAdmin(req, body);

        // Log the update
        Logger.info(`Updated user ${body.id} by admin ${req.session.userID}`);

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }
}

// Singleton instance
export default new User();