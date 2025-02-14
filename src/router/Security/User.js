import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./UserValidator.js";
import Logger from "../../components/logger.js";

// User object for the security module
export class User{
    // Assign a profile to a user
    async AssignUserProfile(req, res, next){
        try {
            // Validate the request
            const body = HandleValidation(req, res, Validator.AssignUserProfile);

            // Log the assignment
            Logger.info(`Assigning profile ${body.profile_id} to user ${body.userID}`);

            // Send the response
            res.status(200).json(SuccessJSendBody())
        } catch (error) {
            next(error)
        }
    }

    // Revoke a profile from a user
    async RevokeUserProfile(req, res, next){
        try {
            // Validate the request
            const body = HandleValidation(req, res, Validator.RevokeUserProfile);

            // Log the revocation
            Logger.info(`Revoking profile ${body.profile_id} from user ${body.userID}`);

            // Send the response
            res.status(200).json(SuccessJSendBody())
        } catch (error) {
            next(error)
        }
    }
}

// Singleton instance
export default new User();