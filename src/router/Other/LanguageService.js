import DatabaseManager from "../../components/database.js";
import {
    GET_ALL_LANGUAGES_FN,
    SEARCH_LANGUAGE_BY_NAME_FN,
} from "../../database/model/functions.js";

// Service for the language object
export class LanguageService {
    // Gets all languages
    async GetAllLanguages() {
        const queryRes = await DatabaseManager.rawQuery(GET_ALL_LANGUAGES_FN);
        return queryRes.rows;
    }

    // Searches language by name
    async SearchLanguageByName(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            SEARCH_LANGUAGE_BY_NAME_FN,
            body.name,
            body.limit
        );
        return queryRes.rows;
    }
}

// Singleton instance of the language service
export default new LanguageService();