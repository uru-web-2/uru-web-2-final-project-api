// Handle the request validation
import Logger from "@ralvarezdev/js-logger";
import {IS_DEBUG} from "@ralvarezdev/js-mode";
import {errorResponse} from "./responses.js";

export function HandleValidation(req, res, validationFn){
    // Validate the request
    const [body, isValid] = validationFn(req);

    // Check if the request is valid
    if (!isValid)
        return res.status(400).json(body);
}

// Handle the request error
export function HandleError(res, error){
    // Log the error
    if (Logger)
        Logger.error(error);

    // Send the response according to the environment
    if (IS_DEBUG)
        res.status(500).json(errorResponse(error.message));
    else
        res.status(500).json(errorResponse("Internal server error"));
}

// Error catcher
export function ErrorCatcher(req, res, next){
    // Catch the error
    try {
        // Execute the next middleware
        next()
    } catch (error) {
        // Handle the error
        HandleError(res, error)
    }
}