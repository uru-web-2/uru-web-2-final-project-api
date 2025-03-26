import {Validate} from "@ralvarezdev/js-joi-parser";
import {
    CREATE_PUBLISHER_MODEL,
    DELETE_PUBLISHER_MODEL,
    SEARCH_PUBLISHER_BY_NAME_MODEL,
    UPDATE_PUBLISHER_MODEL
} from "./PublisherModel.js";

// Validator for the publisher object
export class PublisherValidator {
    // Validate create publisher
    CreatePublisher(req) {
        return Validate(req, CREATE_PUBLISHER_MODEL);
    }

    // Validate update publisher
    UpdatePublisher(req) {
        return Validate(req, UPDATE_PUBLISHER_MODEL);
    }

    // Validate delete publisher
    DeletePublisher(req) {
        return Validate(req, DELETE_PUBLISHER_MODEL);
    }

    // Validate search publisher by name
    SearchPublisherByName(req) {
        return Validate(req, SEARCH_PUBLISHER_BY_NAME_MODEL);
    }
}

// Singleton instance of the PublisherValidator
export default new PublisherValidator();