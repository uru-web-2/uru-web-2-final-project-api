import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./ProfileValidator.js";
import Logger from "../../components/Logger.js";

// Profile object for the security module
export class Profile{
    // Assign a permission to a profile
    async AssignProfilePermission(req, res, next){
        try {
            // Validate the request
            const body = HandleValidation(req, res, Validator.AssignProfilePermission);

            // Log the assignment
            Logger.info(`Assigned permission to profile ${body.profile_id} to method ${body.method_id}`)

            // Send the response
            res.status(201).json(SuccessJSendBody())
        } catch (error) {
            next(error)
        }
    }

    // Revoke a permission from a profile
    async RevokeProfilePermission(req, res, next){
        try {
            // Validate the request
            const body = HandleValidation(req, res, Validator.RevokeProfilePermission);

            // Log the revocation
            Logger.info(`Revoked permission from profile ${body.profile_id} to method ${body.method_id}`)

            // Send the response
            res.status(200).json(SuccessJSendBody())
        } catch (error) {
            next(error)
        }
    }

    // Create a profile
    async CreateProfile(req, res, next){
        try {
            // Validate the request
            const body = HandleValidation(req, res, Validator.CreateProfile);

            // Log the creation
            Logger.info(`Created profile ${body.name}`)

            // Send the response
            res.status(201).json(SuccessJSendBody())
        } catch (error) {
            next(error)
        }
    }

    // Update a profile
    async UpdateProfile(req, res, next){
        try {
            // Validate the request
            const body = HandleValidation(req, res, Validator.UpdateProfile);

            // Log the update
            Logger.info(`Updated profile ${body.id} name to ${body.name}`)

            // Send the response
            res.status(200).json(SuccessJSendBody())
        } catch (error) {
            next(error)
        }
    }

    // Delete a profile
    async DeleteProfile(req, res, next){
        try {
            // Validate the request
            const body = HandleValidation(req, res, Validator.DeleteProfile);

            // Log the deletion
            Logger.info(`Deleted profile ${body.id}`)

            // Send the response
            res.status(200).json(SuccessJSendBody())
        } catch (error) {
            next(error)
        }
    }

    // Get the methods IDs and names from the permissions of a profile
    async GetProfilePermissionsMethods(req, res, next){
        try {
            // Validate the request
            const body = HandleValidation(req, res, Validator.GetProfilePermissionsMethods);

            // Log the request
            Logger.info(`Getting methods from permissions of profile ${body.id}`)

            // Send the response
            res.status(200).json(SuccessJSendBody({methods: []}))
        } catch (error) {
            next(error)
        }
    }
}

// Singleton instance
export default new Profile();