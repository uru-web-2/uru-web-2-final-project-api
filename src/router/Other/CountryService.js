import DatabaseManager from "../../components/database.js";
import {
    GET_ALL_COUNTRIES_FN,
    SEARCH_COUNTRY_BY_NAME_FN,
} from "../../database/model/functions.js";

// Service for the country object
export class CountryService {
    // Get all countries
    async GetAllCountries() {
        const queryRes = await DatabaseManager.rawQuery(GET_ALL_COUNTRIES_FN);
        return queryRes.rows;
    }

    // Search country by name
    async SearchCountryByName(name) {
        const queryRes = await DatabaseManager.rawQuery(
            SEARCH_COUNTRY_BY_NAME_FN,
            name
        );
        return queryRes.rows;
    }
}

// Singleton instance of the country service
export default new CountryService();