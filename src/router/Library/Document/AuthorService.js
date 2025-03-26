import DatabaseManager from "../../../components/database.js";
import {
    ASSIGN_DOCUMENT_AUTHOR_PROC,
    REMOVE_DOCUMENT_AUTHOR_PROC
} from "../../../database/model/storedProcedures.js";
import {
    GET_DOCUMENT_AUTHORS_BY_DOCUMENT_ID_FN
} from "../../../database/model/functions.js";

// Service for the author object
export class AuthorService {
    // Assign document author
    async AssignDocumentAuthor(req, body) {
        await DatabaseManager.rawQuery(
            ASSIGN_DOCUMENT_AUTHOR_PROC,
            req.session.userID,
            body.author_id,
            body.document_id
        );
    }

    // Remove document author
    async RemoveDocumentAuthor(req, body) {
        await DatabaseManager.rawQuery(
            REMOVE_DOCUMENT_AUTHOR_PROC,
            req.session.userID,
            body.author_id,
            body.document_id
        );
    }

    // Get document authors by document ID
    async GetDocumentAuthorsByDocumentID(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            GET_DOCUMENT_AUTHORS_BY_DOCUMENT_ID_FN,
            body.id
        );
        return queryRes.rows;
    }
}

// Singleton instance of the author service
export default new AuthorService();