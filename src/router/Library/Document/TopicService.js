import DatabaseManager from "../../../components/database.js";
import {
    CREATE_DOCUMENT_TOPIC_PROC,
    REMOVE_DOCUMENT_TOPIC_PROC
} from "../../../database/model/storedProcedures.js";
import {
    GET_DOCUMENT_TOPICS_BY_DOCUMENT_ID_FN
} from "../../../database/model/functions.js";

// Service for the topic object
export class TopicService {
    // Creates a document topic
    async CreateDocumentTopic(req, body) {
        await DatabaseManager.rawQuery(
            CREATE_DOCUMENT_TOPIC_PROC,
            req.session.userID,
            body.topic_id,
            body.document_id
        );
    }

    // Removes a document topic
    async RemoveDocumentTopic(req, body) {
        await DatabaseManager.rawQuery(
            REMOVE_DOCUMENT_TOPIC_PROC,
            req.session.userID,
            body.topic_id,
            body.document_id
        );
    }

    // Gets a document topics by document ID
    async GetDocumentTopicsByDocumentID(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            GET_DOCUMENT_TOPICS_BY_DOCUMENT_ID_FN,
            body.id
        );
        return queryRes.rows;
    }
}

// Singleton instance of the topic service
export default new TopicService();