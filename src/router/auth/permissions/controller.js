// Controller of the auth route
import {HandleValidation} from "@ralvarezdev/js-express";
import {AddMetadataProfiles} from "@ralvarezdev/js-module-permissions";

// Controller for the auth route
export class Controller {
    // Handle the SignUp request
    SignUp(req, res) {   }

    // Handle the LogIn request
    LogIn(req, res) {}
}

// Export an instance of the controller
export const CONTROLLER = new Controller();

// Set the profiles permissions for each method on the controller
AddMetadataProfiles(Controller, "SignUp","student");
AddMetadataProfiles(Controller, "LogIn","developer", "user");
