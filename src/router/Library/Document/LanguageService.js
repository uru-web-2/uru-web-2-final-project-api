import DatabaseManager from "../../../components/database.js";
import {
    ASSIGN_DOCUMENT_LANGUAGE_PROC,
    REMOVE_DOCUMENT_LANGUAGE_PROC
} from "../../../database/model/storedProcedures.js";
import {
    GET_DOCUMENT_LANGUAGES_BY_DOCUMENT_ID_FN
} from "../../../database/model/functions.js";

// Service for the language object
export class LanguageService {
    // Assign document language
    async AssignDocumentLanguage(req, body) {
        await DatabaseManager.rawQuery(
            ASSIGN_DOCUMENT_LANGUAGE_PROC,
            req.session.userID,
            body.language_id,
            body.document_id
        );
    }

    // Remove document language
    async RemoveDocumentLanguage(req, body) {
        await DatabaseManager.rawQuery(
            REMOVE_DOCUMENT_LANGUAGE_PROC,
            req.session.userID,
            body.language_id,
            body.document_id
        );
    }

    // Get document languages by document ID
    async GetDocumentLanguagesByDocumentID(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            GET_DOCUMENT_LANGUAGES_BY_DOCUMENT_ID_FN,
            body.id
        );
        return queryRes.rows;
    }
}

// Singleton instance of the language service
export default new LanguageService();