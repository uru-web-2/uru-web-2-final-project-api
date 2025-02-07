import {AddMetadataProfiles} from "@ralvarezdev/js-module-permissions";

// Controller for the base route
export class Controller {
    // Execute the request
    Execute(req, res) {
        // Handle the request
        res.status(200).json({message: "Request executed"})
    }
}

// Export an instance of the controller
export const CONTROLLER = new Controller();

// Set the profiles permissions for each method on the controller
AddMetadataProfiles(Controller, "Execute", "admin");
