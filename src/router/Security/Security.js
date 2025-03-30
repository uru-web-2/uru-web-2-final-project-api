import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./SecurityValidator.js";
import Logger from "../../components/Logger.js";
import Service from "./SecurityService.js";

// Security object for the security module
export class Security {
    // Creates a permission to a profile
    async CreateProfilePermission(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.CreateProfilePermission
        );

        // Create the permission
        const permissionID = await Service.CreateProfilePermission(req, body)

        // Log the creation
        Logger.info(`Created permission ${permissionID} to profile ${body.profile_id} to method ${body.method_id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Removes a permission from a profile
    async RemoveProfilePermission(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.RemoveProfilePermission
        );

        // Remove the permission
        const permissionID = await Service.RemoveProfilePermission(req, body)

        // Log the removal
        Logger.info(`Removed permission ${permissionID} from profile ${body.profile_id} to method ${body.method_id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Gets the methods IDs and names from the permissions of a profile
    async GetProfilePermissionsMethods(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.GetProfilePermissionsMethods
        );

        // Get the methods
        const methods = await Service.GetProfilePermissionsMethods(req, body)

        // Log the retrieval
        Logger.info(`Retrieved methods from permissions of profile ${body.profile_id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({methods}))
    }

    // Gets all modules
    async GetModules(req, res) {
        // Get the modules
        const modules = await Service.GetModules(req)

        // Log the retrieval
        Logger.info(`Retrieved all modules by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({modules}))
    }

    // Gets all objects by module ID
    async GetObjectsByModuleID(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.GetObjectsByModuleID);

        // Get the objects
        const objects = await Service.GetObjectsByModuleID(req, body)

        // Log the retrieval
        Logger.info(`Retrieved all objects by module ID ${body.module_id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({objects}))
    }

    // Gets all methods by object ID
    async GetMethodsByObjectID(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.GetMethodsByObjectID);

        // Get the methods
        const methods = await Service.GetMethodsByObjectID(req, body)

        // Log the retrieval
        Logger.info(`Retrieved all methods by object ID ${body.object_id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({methods}))
    }

    // Creates a profile to a user
    async CreateUserProfile(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.CreateUserProfile);

        // Create the profile
        const userID = await Service.CreateUserProfile(req, body);

        // Log the creation
        Logger.info(`Created profile ${body.profile_id} to user ${userID} by admin ${req.session.userID}`);

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Removes a profile from a user
    async RemoveUserProfile(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.RemoveUserProfile);

        // Remove the profile
        const userID = await Service.RemoveUserProfile(req, body);

        // Log the removal
        Logger.info(`Removed profile ${body.profile_id} from user ${userID} by admin ${req.session.userID}`);

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Gets methods by profile ID and object ID
    async GetMethodsByProfileIDObjectID(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.GetMethodsByProfileIDObjectID
        );

        // Get the methods
        const methods = await Service.GetMethodsByProfileIDObjectID(req, body)

        // Log the retrieval
        Logger.info(`Retrieved methods from profile ${body.profile_id} and object ${body.object_id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({methods}))
    }

    // Sets profile permissions
    async SetProfilePermissions(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.SetProfilePermissions
        );

        // Set the permissions
        await Service.SetProfilePermissions(req, body)

        // Log the setting
        Logger.info(`Set permissions for profile ${body.profile_id} by admin ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }
}

// Singleton instance
export default new Security();