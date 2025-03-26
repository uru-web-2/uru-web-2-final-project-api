import {Validate} from "@ralvarezdev/js-joi-parser";
import {
    CREATE_LOCATION,
    DELETE_LOCATION,
    GET_ALL_LOCATIONS,
    UPDATE_LOCATION
} from "./LocationModel.js";

// Validator for the location object
export class LocationValidator {
    // Validate create location
    CreateLocation(req) {
        return Validate(req, CREATE_LOCATION);
    }

    // Validate update location
    UpdateLocation(req) {
        return Validate(req, UPDATE_LOCATION);
    }

    // Validate delete location
    DeleteLocation(req) {
        return Validate(req, DELETE_LOCATION);
    }

    // Validate get all locations
    GetAllLocations(req) {
        return Validate(req, GET_ALL_LOCATIONS);
    }
}

// Singleton instance of the LocationValidator
export default new LocationValidator();