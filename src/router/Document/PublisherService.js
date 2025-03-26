import {PostgresIsUniqueConstraintError} from "@ralvarezdev/js-dbmanager";
import {PUBLISHERS_UNIQUE_NAME} from "../../database/model/constraints.js";
import DatabaseManager from "../../components/database.js";
import {
    CREATE_PUBLISHER_PROC, DELETE_PUBLISHER_PROC,
    UPDATE_PUBLISHER_PROC
} from "../../database/model/storedProcedures.js";
import {FieldFailError} from "@ralvarezdev/js-express";
import {GET_ALL_PUBLISHERS_FN} from "../../database/model/functions.js";

// Service for the publisher object
export class PublisherService {
    // Creates a publisher
    async CreatePublisher(req, body) {
        try {
            const queryRes = await DatabaseManager.rawQuery(
                CREATE_PUBLISHER_PROC,
                req.session.userID,
                body.name,
                body.description,
                null,
            );
            const queryRow = queryRes.rows?.[0];

            return queryRow?.out_publisher_id;
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the constraint is the unique name constraint
            if (constraintName === PUBLISHERS_UNIQUE_NAME)
                throw new FieldFailError(400, 'name', 'Name is already taken')
            throw error
        }
    }

    // Updates a publisher
    async UpdatePublisher(req, body) {
        try {
            const queryRes = await DatabaseManager.rawQuery(
                UPDATE_PUBLISHER_PROC,
                req.session.userID,
                body.id,
                body.name,
                body.description,
                null,
            );
            const queryRow = queryRes.rows?.[0];

            if (queryRow?.out_publisher_id_is_valid === false)
                throw new FieldFailError(400, 'id', 'Publisher ID is invalid');
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the constraint is the unique name constraint
            if (constraintName === PUBLISHERS_UNIQUE_NAME)
                throw new FieldFailError(400, 'name', 'Name is already taken')
            throw error
        }
    }

    // Deletes a publisher
    async DeletePublisher(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            DELETE_PUBLISHER_PROC,
            req.session.userID,
            body.id,
            null,
        );
        const queryRow = queryRes.rows?.[0];

        if (queryRow?.out_publisher_id_is_valid === false)
            throw new FieldFailError(400, 'id', 'Publisher ID is invalid');
    }

    // Get all publishers
    async GetAllPublishers() {
        const queryRes = await DatabaseManager.rawQuery(
            GET_ALL_PUBLISHERS_FN,
        );
        return queryRes.rows;
    }
}

// Singleton instance of the publisher service
export default new PublisherService();