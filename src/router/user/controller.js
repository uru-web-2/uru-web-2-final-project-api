import {AddMetadataProfiles} from "@ralvarezdev/js-module-permissions";
import {PROFILES} from "../../components/security.js";
import {
    FieldFailError,
    HandleValidation,
    SuccessJSendBody
} from "@ralvarezdev/js-express";
import {Validate} from "@ralvarezdev/js-joi-parser";
import {SIGN_UP} from "../../components/model.js";
import bcrypt from "bcrypt";
import {SALT_ROUNDS} from "../../components/bcrypt.js";
import DatabaseManager from "../../components/database.js";
import {SIGN_UP_PROC} from "../../database/model/storedProcedures.js";
import Logger from "../../components/logger.js";
import {PostgresIsUniqueConstraintError} from "@ralvarezdev/js-dbmanager";
import {
    USER_EMAILS_UNIQUE_EMAIL,
    USER_USERNAMES_UNIQUE_USERNAME
} from "../../database/model/constraints.js";
import {VALIDATOR} from "./validator.js";

// Controller for the user route
export class Controller {
    // Add a profile to the user
    async AddProfile(req, res) {
        try {
            // Validate the request
            const body = HandleValidation(req, res, VALIDATOR.AddProfile);

            // Hash the password
            body.password_hash = bcrypt.hashSync(req.body.password, SALT_ROUNDS)

            // Create the user
            let userID
            const queryRes = await DatabaseManager.rawQuery(SIGN_UP_PROC, body.first_name, body.last_name, body.username, body.email, body.password_hash, null)
            if (queryRes.rows.length > 0)
                userID = queryRes.rows[0]?.out_user_id

            // Log the user ID
            Logger.info(`User signed up with ID: ${userID}`)

            // Send the response
            res.status(200).json(SuccessJSendBody())
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the username has already been registered
            if (constraintName === USER_USERNAMES_UNIQUE_USERNAME)
                error = new FieldFailError(400, "username", "username has already been registered")
            else if (constraintName === USER_EMAILS_UNIQUE_EMAIL)
                error = new FieldFailError(400, "email", "email has already been registered")

            // Pass the error to the error handler
            next(error)
        }
    }
}

// Export an instance of the controller
export const CONTROLLER = new Controller();

// Set the profiles permissions for each method on the controller
AddMetadataProfiles(Controller, "AddProfile", PROFILES.SUPERADMIN);
