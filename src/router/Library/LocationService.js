import {
    CREATE_LOCATION_PROC,
    REMOVE_LOCATION_PROC,
    UPDATE_LOCATION_PROC
} from "../../database/model/storedProcedures.js";
import DatabaseManager from "../../components/database.js";
import {PostgresIsUniqueConstraintError} from "@ralvarezdev/js-dbmanager";
import {LOCATIONS_UNIQUE_FLOOR_AREA} from "../../database/model/constraints.js";
import {FieldFailError} from "@ralvarezdev/js-express";
import {GET_ALL_LOCATIONS_FN} from "../../database/model/functions.js";

// Service for the location object
export class LocationService {
    // Creates a location
    async CreateLocation(req, body) {
        try {
            const queryRes = await DatabaseManager.rawQuery(
                CREATE_LOCATION_PROC,
                req.session.userID,
                body.floor,
                body.area,
                null,
            );
            const queryRow = queryRes.rows?.[0];

            return queryRow?.out_location_id;
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the constraint is the unique floor area constraint
            if (constraintName === LOCATIONS_UNIQUE_FLOOR_AREA)
                throw new FieldFailError(400,
                    'area',
                    'Area is already taken for this floor'
                )
            throw error
        }
    }

    // Updates a location
    async UpdateLocation(req, body) {
        try {
            const queryRes = await DatabaseManager.rawQuery(
                UPDATE_LOCATION_PROC,
                body.id,
                body.floor,
                body.area,
                null,
            );
            const queryRow = queryRes.rows?.[0];
            if (queryRow?.out_location_id_is_valid === false)
                throw new FieldFailError(400, 'id', 'Location ID is invalid');
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the constraint is the unique floor area constraint
            if (constraintName === LOCATIONS_UNIQUE_FLOOR_AREA)
                throw new FieldFailError(400,
                    'area',
                    'Area is already taken for this floor'
                )
            throw error
        }
    }

    // Removes a location
    async RemoveLocation(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            REMOVE_LOCATION_PROC,
            req.session.userID,
            body.id,
            null,
        );
        const queryRow = queryRes.rows?.[0];
        if (queryRow?.out_location_id_is_valid === false)
            throw new FieldFailError(400, 'id', 'Location ID is invalid');
    }

    // Gets all locations
    async GetAllLocations(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            GET_ALL_LOCATIONS_FN,
            body.limit,
            body.offset,
        );
        return queryRes.rows;
    }
}

// Singleton instance of the location service
export default new LocationService();