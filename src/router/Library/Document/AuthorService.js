import DatabaseManager from "../../../components/database.js";
import {
    ASSIGN_DOCUMENT_AUTHOR_PROC,
    REMOVE_DOCUMENT_AUTHOR_PROC
} from "../../../database/model/storedProcedures.js";
import {
    GET_DOCUMENT_AUTHORS_BY_DOCUMENT_ID_FN
} from "../../../database/model/functions.js";
import {PostgresIsUniqueConstraintError} from "@ralvarezdev/js-dbmanager";
import {
    DOCUMENT_AUTHORS_UNIQUE_DOCUMENT_ID_AUTHOR_ID
} from "../../../database/model/constraints.js";
import {FieldFailError} from "@ralvarezdev/js-express";

// Service for the author object
export class AuthorService {
    // Assign document author
    async AssignDocumentAuthor(req, body) {
        try {
            await DatabaseManager.rawQuery(
                ASSIGN_DOCUMENT_AUTHOR_PROC,
                req.session.userID,
                body.author_id,
                body.document_id
            );
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the constraint is the unique document ID and author ID constraint
            if (constraintName === DOCUMENT_AUTHORS_UNIQUE_DOCUMENT_ID_AUTHOR_ID)
                throw new FieldFailError(400,
                    'author_id',
                    'Author is already assigned to document'
                )
            throw error
        }
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