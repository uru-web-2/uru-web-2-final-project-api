import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "../Thesis/ThesisValidator.js";
import Service from "../Thesis/ThesisService.js";
import Logger from "../../../../components/logger.js";

// Thesis object for the thesis module
export class Thesis {
    // Creates a thesis
    async CreateThesis(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.CreateThesis);

        // Create the thesis
        const thesisID = await Service.CreateThesis(req, body);

        // Log the creation
        Logger.info(`Created thesis ${thesisID} by admin ${req.session.userID}`);

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }
}

// Singleton instance
export default new Thesis();