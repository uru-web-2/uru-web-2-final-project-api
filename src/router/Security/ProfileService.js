import DatabaseManager from "../../components/database.js";
import {FieldFailError} from "@ralvarezdev/js-express";
import {
    CREATE_PROFILE_PROC,
    DELETE_PROFILE_PROC,
    UPDATE_PROFILE_PROC
} from "../../database/model/storedProcedures.js";
import {PROFILES_UNIQUE_NAME} from "../../database/model/constraints.js";
import {PostgresIsUniqueConstraintError} from "@ralvarezdev/js-dbmanager";
import {
    GET_ALL_PROFILES_FN,
    SEARCH_PROFILE_BY_NAME_FN
} from "../../database/model/functions.js";
import Security from "../../components/security.js";

// Service for the profile object
export class ProfileService {
    // Creates a profile
    async CreateProfile(req, body) {
        try {
            const queryRes = await DatabaseManager.rawQuery(
                CREATE_PROFILE_PROC,
                req.session.userID,
                body.name,
                null
            );
            const queryRow = queryRes.rows?.[0];
            const profileID = queryRow?.out_profile_id;

            // Add the profile ID to the security component
            Security.addProfile(profileID, body.name)

            return profileID;
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the constraint is the unique name constraint
            if (constraintName === PROFILES_UNIQUE_NAME)
                throw new FieldFailError('name', 'Name is already taken')
            throw error
        }
    }

    // Updates a profile
    async UpdateProfile(req, body) {
        try {
            const queryRes = await DatabaseManager.rawQuery(
                UPDATE_PROFILE_PROC,
                req.session.userID,
                body.id,
                body.name,
                body.description,
                null
            );
            const queryRow = queryRes.rows?.[0];

            if (queryRow?.out_is_profile_id_valid === false)
                throw new FieldFailError('id', 'Profile ID is invalid');

            // Update the profile to the security component
            Security.updateProfile(body.id, body.name)
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the constraint is the unique name constraint
            if (constraintName === PROFILES_UNIQUE_NAME)
                throw new FieldFailError('name', 'Name is already taken')
            throw error
        }
    }

    // Deletes a profile
    async DeleteProfile(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            DELETE_PROFILE_PROC,
            req.session.userID,
            body.id,
            null
        );
        const queryRow = queryRes.rows?.[0];

        if (queryRow?.out_is_profile_id_valid === false)
            throw new FieldFailError('id', 'Profile ID is invalid');

        // Remove the profile ID from the security component
        Security.removeProfile(body.id)
    }

    // Searches for a profile by name
    async SearchProfileByName(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            SEARCH_PROFILE_BY_NAME_FN,
            body.name
        );
        return queryRes.rows;
    }

    // Get all profiles
    async GetAllProfiles(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            GET_ALL_PROFILES_FN,
        );
        return queryRes.rows;
    }
}

// Singleton instance of the profile service
export default new ProfileService();