import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./MagazineIssueValidator.js";
import Service from "./MagazineIssueService.js";
import Logger from "../../../../components/logger.js";

// MagazineIssue object for the magazine issue module
export class MagazineIssue {
    // Creates a magazine issue
    async CreateMagazineIssue(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.CreateMagazineIssue);

        // Create the magazine issue
        const magazineIssueID = await Service.CreateMagazineIssue(req, body);

        // Log the creation
        Logger.info(`Created magazine issue ${magazineIssueID} by admin ${req.session.userID}`);

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }
}

// Singleton instance
export default new MagazineIssue();