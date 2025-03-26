import {Validate} from "@ralvarezdev/js-joi-parser";
import {
    ASSIGN_DOCUMENT_TOPIC_MODEL,
    CREATE_TOPIC_MODEL,
    DELETE_TOPIC_MODEL,
    REMOVE_DOCUMENT_TOPIC_MODEL,
    SEARCH_TOPIC_BY_NAME_MODEL,
    UPDATE_TOPIC_MODEL
} from "./TopicModel.js";

// Validator for the topic object
export class TopicValidator {
    // Validate create topic
    CreateTopic(req) {
        return Validate(req, CREATE_TOPIC_MODEL);
    }

    // Validate update topic
    UpdateTopic(req) {
        return Validate(req, UPDATE_TOPIC_MODEL);
    }

    // Validate delete topic
    DeleteTopic(req) {
        return Validate(req, DELETE_TOPIC_MODEL);
    }

    // Validate search topic by name
    SearchTopicByName(req) {
        return Validate(req, SEARCH_TOPIC_BY_NAME_MODEL);
    }

    // Validate assign document topic
    AssignDocumentTopic(req) {
        return Validate(req, ASSIGN_DOCUMENT_TOPIC_MODEL);
    }

    // Validate remove document topic
    RemoveDocumentTopic(req) {
        return Validate(req, REMOVE_DOCUMENT_TOPIC_MODEL);
    }
}

// Singleton instance of the TopicValidator
export default new TopicValidator();