import {Validate} from "@ralvarezdev/js-joi-parser";
import {
    CREATE_PUBLISHER,
    DELETE_PUBLISHER,
    SEARCH_PUBLISHER_BY_NAME,
    UPDATE_PUBLISHER
} from "./PublisherModel.js";

// Validator for the publisher object
export class PublisherValidator {
    // Validate create publisher
    CreatePublisher(req) {
        return Validate(req, CREATE_PUBLISHER);
    }

    // Validate update publisher
    UpdatePublisher(req) {
        return Validate(req, UPDATE_PUBLISHER);
    }

    // Validate delete publisher
    DeletePublisher(req) {
        return Validate(req, DELETE_PUBLISHER);
    }

    // Validate search publisher by name
    SearchPublisherByName(req) {
        return Validate(req, SEARCH_PUBLISHER_BY_NAME);
    }
}

// Singleton instance of the PublisherValidator
export default new PublisherValidator();