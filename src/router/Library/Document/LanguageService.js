import DatabaseManager from "../../../components/database.js";
import {
    ASSIGN_DOCUMENT_LANGUAGE_PROC,
    REMOVE_DOCUMENT_LANGUAGE_PROC
} from "../../../database/model/storedProcedures.js";
import {
    GET_DOCUMENT_LANGUAGES_BY_DOCUMENT_ID_FN
} from "../../../database/model/functions.js";
import {PostgresIsUniqueConstraintError} from "@ralvarezdev/js-dbmanager";
import {
    DOCUMENT_LANGUAGES_UNIQUE_DOCUMENT_ID_LANGUAGE_ID
} from "../../../database/model/constraints.js";
import {FieldFailError} from "@ralvarezdev/js-express";

// Service for the language object
export class LanguageService {
    // Assign document language
    async AssignDocumentLanguage(req, body) {
        try {
            await DatabaseManager.rawQuery(
                ASSIGN_DOCUMENT_LANGUAGE_PROC,
                req.session.userID,
                body.language_id,
                body.document_id
            );
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the constraint is the unique document ID and language ID constraint
            if (constraintName === DOCUMENT_LANGUAGES_UNIQUE_DOCUMENT_ID_LANGUAGE_ID)
                throw new FieldFailError(400,
                    'language_id',
                    'Language is already assigned to the document'
                )
            throw error
        }
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