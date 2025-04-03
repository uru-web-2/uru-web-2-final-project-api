import {
    CREATE_LOCATION_SECTION_PROC,
    REMOVE_LOCATION_SECTION_PROC,
    UPDATE_LOCATION_SECTION_PROC,
} from "../../database/model/storedProcedures.js";
import DatabaseManager from "../../components/database.js";
import {PostgresIsUniqueConstraintError} from "@ralvarezdev/js-dbmanager";
import {
    LOCATION_SECTIONS_UNIQUE_LOCATION_ID_NAME
} from "../../database/model/constraints.js";
import {FieldFailError} from "@ralvarezdev/js-express";
import {
    GET_ALL_LOCATION_SECTIONS_FN,
    GET_LOCATION_SECTIONS_BY_LOCATION_ID_FN
} from "../../database/model/functions.js";

// Service for the location section object
export class LocationSectionService {
    // Creates a location section
    async CreateLocationSection(req, body) {
        try {
            const queryRes = await DatabaseManager.rawQuery(
                CREATE_LOCATION_SECTION_PROC,
                req.session.userID,
                body.location_id,
                body.name,
                null,
            );
            const queryRow = queryRes.rows?.[0];
            if (queryRow?.out_location_id_is_valid === false)
                throw new FieldFailError(400,
                    'location_id',
                    'Location ID is invalid'
                );

            return queryRow?.out_location_id;
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the constraint is the unique location ID and name constraint
            if (constraintName === LOCATION_SECTIONS_UNIQUE_LOCATION_ID_NAME)
                throw new FieldFailError(400,
                    'name',
                    'Name is already taken for this location'
                );
        }
    }

    // Updates a location section
    async UpdateLocationSection(req, body) {
        try {
            const queryRes = await DatabaseManager.rawQuery(
                UPDATE_LOCATION_SECTION_PROC,
                body.id,
                body.name,
                null,
            );
            const queryRow = queryRes.rows?.[0];
            if (queryRow?.out_location_id_is_valid === false)
                throw new FieldFailError(400, 'id', 'Location ID is invalid');
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the constraint is the unique location ID and name constraint
            if (constraintName === LOCATION_SECTIONS_UNIQUE_LOCATION_ID_NAME)
                throw new FieldFailError(400,
                    'name',
                    'Name is already taken for this location'
                );
        }
    }

    // Removes a location section
    async RemoveLocationSection(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            REMOVE_LOCATION_SECTION_PROC,
            req.session.userID,
            body.id,
            null,
        );
        const queryRow = queryRes.rows?.[0];
        if (queryRow?.out_location_id_is_valid === false)
            throw new FieldFailError(400, 'id', 'Location ID is invalid');
    }

    // Gets all location sections
    async GetAllLocationSections(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            GET_ALL_LOCATION_SECTIONS_FN,
            body.limit,
            body.offset,
        );
        return queryRes.rows;
    }

    // Gets location sections by location ID
    async GetLocationSectionsByLocationID(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            GET_LOCATION_SECTIONS_BY_LOCATION_ID_FN,
            body.location_id,
        );
        return queryRes.rows;
    }
}

// Singleton instance of the location section service
export default new LocationSectionService();