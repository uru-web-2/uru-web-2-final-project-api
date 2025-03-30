import {Validate} from "@ralvarezdev/js-joi-parser";
import {
    CREATE_DOCUMENT_LOCATION_SECTION,
    GET_DOCUMENT_LOCATION_SECTIONS_BY_DOCUMENT_ID,
    REMOVE_DOCUMENT_LOCATION_SECTION,
} from "./LocationSectionModel.js";

// Validator for the location section object
export class LocationSectionValidator {
    // Create assign document author
    CreateDocumentLocationSection(req) {
        return Validate(req, CREATE_DOCUMENT_LOCATION_SECTION);
    }

    // Validate remove document author
    RemoveDocumentLocationSection(req) {
        return Validate(req, REMOVE_DOCUMENT_LOCATION_SECTION);
    }

    // Validate get document authors by document ID
    GetDocumentLocationSectionsByDocumentID(req) {
        return Validate(req, GET_DOCUMENT_LOCATION_SECTIONS_BY_DOCUMENT_ID);
    }
}

// Singleton instance of the LocationSectionValidator
export default new LocationSectionValidator();