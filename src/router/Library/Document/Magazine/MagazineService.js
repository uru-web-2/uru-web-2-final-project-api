import DatabaseManager from "../../../../components/database.js";
import {
    CREATE_MAGAZINE_PROC, REMOVE_MAGAZINE_PROC, UPDATE_MAGAZINE_PROC
} from "../../../../database/model/storedProcedures.js";
import {
    GET_ALL_MAGAZINES_FN,
    SEARCH_MAGAZINE_BY_NAME_FN
} from "../../../../database/model/functions.js";
import {FieldFailError} from "@ralvarezdev/js-express";

// Service for the magazine object
export class MagazineService {    
    // Creates a magazine
    async CreateMagazine(req, body) {
        const queryRes=await DatabaseManager.rawQuery(
            CREATE_MAGAZINE_PROC,
            req.session.userID,
            body.name, 
            body.description,
            body.release_date,
            null
        );
        const queryRow=queryRes.rows?.[0];

        return queryRow?.out_magazine_id;
    }

    // Updates a magazine
    async UpdateMagazine(req, body) {
        const queryRes=await DatabaseManager.rawQuery(
            UPDATE_MAGAZINE_PROC,
            body.id,
            body.name,
            body.description,
            body.release_date,
            null,
        );
        const queryRow=queryRes.rows?.[0];
        if (queryRow?.out_magazine_id_is_valid === false)
            throw new FieldFailError(400, 'id', 'Magazine ID is invalid');
    }

    // Removes a magazine
    async RemoveMagazine(req, body) {
        const queryRes=await DatabaseManager.rawQuery(
            REMOVE_MAGAZINE_PROC,
            req.session.userID,
            body.id,
            null
        );
        const queryRow=queryRes.rows?.[0];
        if (queryRow?.out_magazine_id_is_valid === false)
            throw new FieldFailError(400, 'id', 'Magazine ID is invalid');
    }

    // Gets all magazines
    async GetAllMagazines(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            GET_ALL_MAGAZINES_FN,
            req.session.userID,
            body.limit,
            body.offset,
        );

        return queryRes.rows;
    }

    // Searches for magazine by name
    async SearchMagazineByName(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            SEARCH_MAGAZINE_BY_NAME_FN,
            req.session.userID,
            body.name,
            body.limit,
        );

        return queryRes.rows;
    }
}

// Singleton instance of the magazine service
export default new MagazineService();