import {PostgresIsUniqueConstraintError} from "@ralvarezdev/js-dbmanager";
import {TOPICS_UNIQUE_NAME} from "../../database/model/constraints.js";
import DatabaseManager from "../../components/database.js";
import {
    CREATE_TOPIC_PROC,
    REMOVE_TOPIC_PROC,
    UPDATE_TOPIC_PROC
} from "../../database/model/storedProcedures.js";
import {FieldFailError} from "@ralvarezdev/js-express";
import {
    GET_ALL_TOPICS_FN,
    SEARCH_TOPIC_BY_NAME_FN
} from "../../database/model/functions.js";

// Service for the topic object
export class TopicService {
    // Creates a topic
    async CreateTopic(req, body) {
        try {
            const queryRes = await DatabaseManager.rawQuery(
                CREATE_TOPIC_PROC,
                req.session.userID,
                body.name,
                body.description,
                null,
            );
            const queryRow = queryRes.rows?.[0];

            return queryRow?.out_topic_id;
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the constraint is the unique name constraint
            if (constraintName === TOPICS_UNIQUE_NAME)
                throw new FieldFailError(400, 'name', 'Name is already taken')
            throw error
        }
    }

    // Updates a topic
    async UpdateTopic(req, body) {
        try {
            const queryRes = await DatabaseManager.rawQuery(
                UPDATE_TOPIC_PROC,
                body.id,
                body.name,
                body.description,
                null,
            );
            const queryRow = queryRes.rows?.[0];

            if (queryRow?.out_topic_id_is_valid === false)
                throw new FieldFailError(400, 'id', 'Topic ID is invalid');
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the constraint is the unique name constraint
            if (constraintName === TOPICS_UNIQUE_NAME)
                throw new FieldFailError(400, 'name', 'Name is already taken')
            throw error
        }
    }

    // Removes a topic
    async RemoveTopic(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            REMOVE_TOPIC_PROC,
            req.session.userID,
            body.id,
            null,
        );
        const queryRow = queryRes.rows?.[0];

        if (queryRow?.out_topic_id_is_valid === false)
            throw new FieldFailError(400, 'id', 'Topic ID is invalid');
    }

    // Gets all topics
    async GetAllTopics(req) {
        const queryRes = await DatabaseManager.rawQuery(
            GET_ALL_TOPICS_FN,
        );
        return queryRes.rows;
    }

    // Searches topic by name
    async SearchTopicByName(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            SEARCH_TOPIC_BY_NAME_FN,
            body.name,
            body.limit
        );
        return queryRes.rows;
    }
}

// Singleton instance of the topic service
export default new TopicService();