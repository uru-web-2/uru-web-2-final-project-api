// Controller of the auth route
import validator from "./validator.js";
import {HandleValidation} from "@ralvarezdev/js-express";
import {AddMetadataProfiles} from "@ralvarezdev/js-module-permissions";

// Controller for the auth route
export class Controller {
    // Handle the SignUp request
    SignUp(req, res) {
        // Validate the request
        const [body, isValid] = HandleValidation(req, res, validator.SingUp);
        if (!isValid) return;

        // Handle the request

    }

    // Handle the LogIn request
    LogIn(req, res) {
        // Validate the request
        const [body, isValid] = HandleValidation(req, res, validator.LogIn);
        if (!isValid) return;

        // Handle the request

    }
}

// Export an instance of the controller
export const CONTROLLER = new Controller();

// Set the profiles permissions for each method on the controller
AddMetadataProfiles(Controller, "SignUp","teacher");
AddMetadataProfiles(Controller, "LogIn","superadmin", "user");
