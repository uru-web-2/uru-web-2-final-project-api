// Controller of the auth route
import validator from "./validator.js";
import {HandleValidation} from "../../components/handler.js";

// Controller for the auth route
class Controller {
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
const CONTROLLER = new Controller();
export default CONTROLLER;