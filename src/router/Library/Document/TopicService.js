import DatabaseManager from "../../../components/database.js";
import {
    ASSIGN_DOCUMENT_TOPIC_PROC,
    REMOVE_DOCUMENT_TOPIC_PROC
} from "../../../database/model/storedProcedures.js";

// Service for the topic object
export class TopicService {
    // Assign document topic
    async AssignDocumentTopic(req, body) {
        await DatabaseManager.rawQuery(
            ASSIGN_DOCUMENT_TOPIC_PROC,
            req.session.userID,
            body.topic_id,
            body.document_id
        );
    }

    // Remove document topic
    async RemoveDocumentTopic(req, body) {
        await DatabaseManager.rawQuery(
            REMOVE_DOCUMENT_TOPIC_PROC,
            req.session.userID,
            body.topic_id,
            body.document_id
        );
    }
}

// Singleton instance of the topic service
export default new TopicService();