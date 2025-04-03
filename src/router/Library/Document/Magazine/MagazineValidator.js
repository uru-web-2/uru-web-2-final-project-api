import {
    CREATE_MAGAZINE,
    GET_ALL_MAGAZINES,
    REMOVE_MAGAZINE,
    SEARCH_MAGAZINE_BY_NAME,
    UPDATE_MAGAZINE
} from "./MagazineModel.js";
import {Validate} from "@ralvarezdev/js-joi-parser";

// Validator for the magazine object
export class MagazineValidator {
    // Validate create magazine
    CreateMagazine(req) {
        return Validate(req, CREATE_MAGAZINE);
    }

    // Validate update magazine
    UpdateMagazine(req) {
        return Validate(req, UPDATE_MAGAZINE);
    }

    // Validate remove magazine
    RemoveMagazine(req) {
        return Validate(req, REMOVE_MAGAZINE);
    }

    // Validate search magazine by name
    SearchMagazineByName(req) {
        return Validate(req, SEARCH_MAGAZINE_BY_NAME);
    }

    // Validate get all magazines
    GetAllMagazines(req) {
        return Validate(req, GET_ALL_MAGAZINES);
    }
}

// Singleton instance of the MagazineValidator
export default new MagazineValidator();