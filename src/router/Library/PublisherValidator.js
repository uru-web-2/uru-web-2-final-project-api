import {Validate} from "@ralvarezdev/js-joi-parser";
import {
    CREATE_PUBLISHER,
    REMOVE_PUBLISHER,
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

    // Validate remove publisher
    RemovePublisher(req) {
        return Validate(req, REMOVE_PUBLISHER);
    }

    // Validate search publisher by name
    SearchPublisherByName(req) {
        return Validate(req, SEARCH_PUBLISHER_BY_NAME);
    }
}

// Singleton instance of the PublisherValidator
export default new PublisherValidator();