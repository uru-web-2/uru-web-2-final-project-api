import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "./CountryValidator.js";
import Service from "./CountryService.js";
import Logger from "../../components/logger.js";

// Country object for the other module
export class Country {
    // Gets all countries
    async GetAllCountries(req, res) {
        // Get all countries
        const countries = await Service.GetAllCountries(req)

        // Log the retrieval
        Logger.info(`Retrieved all countries by user ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({countries}))
    }

    // Searches country by name
    async SearchCountryByName(req, res) {
        // Validate the request
        const body = HandleValidation(req,
            res,
            Validator.SearchCountryByName
        );

        // Search the country
        const countries = await Service.SearchCountryByName(req, body)

        // Log the search
        Logger.info(`Searched country by name ${body.name} by user ${req.session.userID}`)

        // Send the response
        res.status(200).json(SuccessJSendBody({countries}))
    }
}

// Singleton instance
export default new Country();