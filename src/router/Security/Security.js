import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./SecurityValidator.js";
import Logger from "../../components/Logger.js";
import Service from "./SecurityService.js";

// Security object for the security module
export class Security {
    // Assign a permission to a profile
    async AssignProfilePermission(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.AssignProfilePermission
        );

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
        const body = HandleValidation(req,
            res,
            Validator.RevokeProfilePermission
        );

        // Revoke the permission
        const permissionID = await Service.RevokeProfilePermission(req, body)

        // Log the revocation
        Logger.info(`Revoked permission ${permissionID} from profile ${body.profile_id} to method ${body.method_id}`)

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }

    // Get the methods IDs and names from the permissions of a profile
    async GetProfilePermissionsMethods(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.GetProfilePermissionsMethods
        );

        // Get the methods
        const methods = await Service.GetProfilePermissionsMethods(req, body)

        // Log the request
        Logger.info(`Getting methods from permissions of profile ${body.profile_id}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({methods}))
    }

    // Get all modules
    async GetModules(req, res) {
        // Get the modules
        const modules = await Service.GetModules(req)

        // Log the request
        Logger.info(`Getting all modules`)

        // Send the response
        res.status(200).json(SuccessJSendBody({modules}))
    }

    // Get all objects by module ID
    async GetObjectsByModuleID(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.GetObjectsByModuleID);

        // Get the objects
        const objects = await Service.GetObjectsByModuleID(req, body)

        // Log the request
        Logger.info(`Getting all objects by module ID ${body.module_id}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({objects}))
    }

    // Get all methods by object ID
    async GetMethodsByObjectID(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.GetMethodsByObjectID);

        // Get the methods
        const methods = await Service.GetMethodsByObjectID(req, body)

        // Log the request
        Logger.info(`Getting all methods by object ID ${body.object_id}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({methods}))
    }

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
}

// Singleton instance
export default new Security();