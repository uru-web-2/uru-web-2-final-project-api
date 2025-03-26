import {Validate} from "@ralvarezdev/js-joi-parser";
import {
    CREATE_LOCATION_SECTION,
    DELETE_LOCATION_SECTION,
    GET_ALL_LOCATION_SECTIONS,
    GET_LOCATION_SECTIONS_BY_LOCATION_ID,
    UPDATE_LOCATION_SECTION
} from "./LocationSectionModel.js";

// Validator for the location section object
export class LocationSectionValidator {
    // Validate create location section
    CreateLocationSection(req) {
        return Validate(req, CREATE_LOCATION_SECTION);
    }

    // Validate update location section
    UpdateLocationSection(req) {
        return Validate(req, UPDATE_LOCATION_SECTION);
    }

    // Validate delete location section
    DeleteLocationSection(req) {
        return Validate(req, DELETE_LOCATION_SECTION);
    }

    // Validate get all location sections
    GetAllLocationSections(req) {
        return Validate(req, GET_ALL_LOCATION_SECTIONS);
    }

    // Validate get location sections by location ID
    GetLocationSectionsByLocationID(req) {
        return Validate(req, GET_LOCATION_SECTIONS_BY_LOCATION_ID);
    }
}

// Singleton instance of the LocationSectionValidator
export default new LocationSectionValidator();