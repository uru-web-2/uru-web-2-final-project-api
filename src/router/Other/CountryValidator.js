import {Validate} from "@ralvarezdev/js-joi-parser";
import {SEARCH_COUNTRY_BY_NAME} from "./CountryModel.js";

// Validator for the country object
export class CountryValidator {
    // Validate search country by name
    SearchCountryByName(req) {
        return Validate(req, SEARCH_COUNTRY_BY_NAME);
    }
}

// Singleton instance of the CountryValidator
export default new CountryValidator();