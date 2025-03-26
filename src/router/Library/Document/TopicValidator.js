import {Validate} from "@ralvarezdev/js-joi-parser";
import {
    ASSIGN_DOCUMENT_TOPIC,
    REMOVE_DOCUMENT_TOPIC,
} from "./TopicModel.js";

// Validator for the topic object
export class TopicValidator {
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