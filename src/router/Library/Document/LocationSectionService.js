import DatabaseManager from "../../../components/database.js";
import {
    CREATE_DOCUMENT_LOCATION_SECTION_PROC,
    REMOVE_DOCUMENT_LOCATION_SECTION_PROC
} from "../../../database/model/storedProcedures.js";
import {
    GET_DOCUMENT_LOCATION_SECTIONS_BY_DOCUMENT_ID_FN
} from "../../../database/model/functions.js";
import {PostgresIsUniqueConstraintError} from "@ralvarezdev/js-dbmanager";
import {
    DOCUMENT_LOCATION_SECTIONS_UNIQUE_DOCUMENT_ID_LOCATION_SECTION_ID
} from "../../../database/model/constraints.js";
import {FieldFailError} from "@ralvarezdev/js-express";

// Service for the location section object
export class LocationSectionService {
    // Creates a document location section
    async CreateDocumentLocationSection(req, body) {
        try {
            await DatabaseManager.rawQuery(
                CREATE_DOCUMENT_LOCATION_SECTION_PROC,
                req.session.userID,
                body.location_section_id,
                body.document_id
            );
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the constraint is the unique document ID and location section ID constraint
            if (constraintName === DOCUMENT_LOCATION_SECTIONS_UNIQUE_DOCUMENT_ID_LOCATION_SECTION_ID)
                throw new FieldFailError(400,
                    'location_section_id',
                    'Location section is already assigned to this document'
                )
            throw error
        }
    }

    // Removes a document location section
    async RemoveDocumentLocationSection(req, body) {
        await DatabaseManager.rawQuery(
            REMOVE_DOCUMENT_LOCATION_SECTION_PROC,
            req.session.userID,
            body.location_section_id,
            body.document_id
        );
    }

    // Gets a document location sections by document ID
    async GetDocumentLocationSectionsByDocumentID(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            GET_DOCUMENT_LOCATION_SECTIONS_BY_DOCUMENT_ID_FN,
            body.id
        );
        return queryRes.rows;
    }
}

// Singleton instance of the location section service
export default new LocationSectionService();