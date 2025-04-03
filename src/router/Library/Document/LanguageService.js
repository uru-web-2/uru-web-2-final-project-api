import DatabaseManager from "../../../components/database.js";
import {
    CREATE_DOCUMENT_LANGUAGE_PROC,
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
import {uploadArticleFile} from "../../../components/files.js";

// Service for the language object
export class LanguageService {
    // Creates a document language
    async CreateDocumentLanguage(req, body) {
        try {
            const queryRes=await DatabaseManager.rawQuery(
                CREATE_DOCUMENT_LANGUAGE_PROC,
                req.session.userID,
                body.language_id,
                body.document_id,
                null,
                null
            );
            const queryRow = queryRes.rows?.[0];
            if (queryRow?.out_document_id_is_valid === false)
                throw new FieldFailError(400,
                    'document_id',
                    'Document ID is invalid'
                );
            if (queryRow?.out_language_id_is_valid === false)
                throw new FieldFailError(400,
                    'language_id',
                    'Language ID is invalid'
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

    // Removes a document language
    async RemoveDocumentLanguage(req, body) {
        await DatabaseManager.rawQuery(
            REMOVE_DOCUMENT_LANGUAGE_PROC,
            req.session.userID,
            body.language_id,
            body.document_id
        );
    }

    // Gets the document languages by document ID
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