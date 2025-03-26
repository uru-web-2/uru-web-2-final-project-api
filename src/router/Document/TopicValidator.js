import {Validate} from "@ralvarezdev/js-joi-parser";
import {
    ASSIGN_DOCUMENT_TOPIC,
    CREATE_TOPIC,
    DELETE_TOPIC,
    REMOVE_DOCUMENT_TOPIC,
    SEARCH_TOPIC_BY_NAME,
    UPDATE_TOPIC
} from "./TopicModel.js";

// Validator for the topic object
export class TopicValidator {
    // Validate create topic
    CreateTopic(req) {
        return Validate(req, CREATE_TOPIC);
    }

    // Validate update topic
    UpdateTopic(req) {
        return Validate(req, UPDATE_TOPIC);
    }

    // Validate delete topic
    DeleteTopic(req) {
        return Validate(req, DELETE_TOPIC);
    }

    // Validate search topic by name
    SearchTopicByName(req) {
        return Validate(req, SEARCH_TOPIC_BY_NAME);
    }

    // Validate assign document topic
    AssignDocumentTopic(req) {
        return Validate(req, ASSIGN_DOCUMENT_TOPIC);
    }

    // Validate remove document topic
    RemoveDocumentTopic(req) {
        return Validate(req, REMOVE_DOCUMENT_TOPIC);
    }
}

// Singleton instance of the TopicValidator
export default new TopicValidator();