import Logger from "../../components/logger.js";
import Service from "./LanguageService.js";
import Validator from "./LanguageValidator.js";
import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";

// Language object for the other module
export class Language {
    // Get all languages
    async GetAllLanguages(req, res) {
        // Get all languages
        const languages = await Service.GetAllLanguages()

        // Log the retrieval
        Logger.info(`Retrieved all languages by user ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({languages}))
    }

    // Search language by name
    async SearchLanguageByName(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.SearchLanguageByName
        );

        // Search the language
        const languages = await Service.SearchLanguageByName(req, body)

        // Log the search
        Logger.info(`Searched language by name ${body.name} by user ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({languages}))
    }
}

// Singleton instance
export default new Language();