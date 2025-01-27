import {LOG_IN, SIGN_UP} from "../../components/model.js";
import Validate from "@ralvarezdev/js-joi-parser/parser/validate.js";

// Validator for the auth route
class Validator {
    // Validate the SingUp request
    SingUp(req) {
        return Validate(req.body, SIGN_UP);
    }

    // Validate the LogIn request
    LogIn(req) {
        return Validate(req.body, LOG_IN);
    }
}

// Export an instance of the validator
const VALIDATOR = new Validator();
export default VALIDATOR;