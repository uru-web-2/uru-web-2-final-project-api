import {Validate} from "@ralvarezdev/js-joi-parser";
import {
    CREATE_DOCUMENT_TOPIC,
    GET_DOCUMENT_TOPICS_BY_DOCUMENT_ID,
    REMOVE_DOCUMENT_TOPIC,
} from "./TopicModel.js";

// Validator for the topic object
export class TopicValidator {
    // Validate create document topic
    CreateDocumentTopic(req) {
        return Validate(req, CREATE_DOCUMENT_TOPIC);
    }

    // Validate remove document topic
    RemoveDocumentTopic(req) {
        return Validate(req, REMOVE_DOCUMENT_TOPIC);
    }

    // Validate get document topics by document ID
    GetDocumentTopicsByDocumentID(req) {
        return Validate(req, GET_DOCUMENT_TOPICS_BY_DOCUMENT_ID);
    }
}

// Singleton instance of the TopicValidator
export default new TopicValidator();