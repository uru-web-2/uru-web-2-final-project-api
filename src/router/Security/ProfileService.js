import DatabaseManager from "../../components/database.js";
import {FieldFailError} from "@ralvarezdev/js-express";
import {
    ASSIGN_PROFILE_PERMISSION_PROC,
    CREATE_PROFILE_PROC, DELETE_PROFILE_PROC,
    REVOKE_PROFILE_PERMISSION_PROC, UPDATE_PROFILE_PROC
} from "../../database/model/storedProcedures.js";
import {PROFILES_UNIQUE_NAME} from "../../database/model/constraints.js";
import {PostgresIsUniqueConstraintError} from "@ralvarezdev/js-dbmanager";
import {
    GET_PROFILE_PERMISSIONS_METHODS_FN
} from "../../database/model/functions.js";

// Service for the profile object
export class ProfileService {
    // Assigns a permission to a profile
    async AssignProfilePermission(req, body) {
        let queryRes=await DatabaseManager.rawQuery(
            ASSIGN_PROFILE_PERMISSION_PROC,
            req.session.userID,
            body.profile_id,
            body.method_id,
            null,
            null,
            null
        );
        queryRes=queryRes.rows?.[0];

        if (queryRes?.out_is_profile_id_valid === false)
            throw new FieldFailError('profile_id', 'Profile ID is invalid');
        if (queryRes?.out_is_method_id_valid === false)
            throw new FieldFailError('method_id', 'Method ID is invalid');
        return queryRes?.out_permission_id;
    }

    // Revokes a permission from a profile
    async RevokeProfilePermission(req, body) {
        let queryRes=await DatabaseManager.rawQuery(
            REVOKE_PROFILE_PERMISSION_PROC,
            req.session.userID,
            body.profile_id,
            body.method_id,
            null,
            null,
            null
        );
        queryRes=queryRes.rows?.[0];

        if (queryRes?.out_is_profile_id_valid === false)
            throw new FieldFailError('profile_id', 'Profile ID is invalid');
        if (queryRes?.out_is_method_id_valid === false)
            throw new FieldFailError('method_id', 'Method ID is invalid');
        return queryRes?.out_permission_id;
    }

    // Creates a profile
    async CreateProfile(req, body) {
        try {
            let queryRes = await DatabaseManager.rawQuery(
                CREATE_PROFILE_PROC,
                req.session.userID,
                body.name,
                null
            );
            return queryRes.rows?.[0]?.out_profile_id;
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
            let queryRes = await DatabaseManager.rawQuery(
                UPDATE_PROFILE_PROC,
                req.session.userID,
                body.profile_id,
                body.name,
                null
            );
            queryRes = queryRes.rows?.[0];

            if (queryRes?.out_is_profile_id_valid === false)
                throw new FieldFailError('profile_id', 'Profile ID is invalid');
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
        let queryRes = await DatabaseManager.rawQuery(
            DELETE_PROFILE_PROC,
            req.session.userID,
            body.profile_id,
            null
        );
        queryRes = queryRes.rows?.[0];

        if (queryRes?.out_is_profile_id_valid === false)
            throw new FieldFailError('profile_id', 'Profile ID is invalid');
    }

    // Gets the methods IDs and names from the permissions of a profile
    async GetProfilePermissionsMethods(req, profileID) {
        let queryRes = await DatabaseManager.rawQuery(
            GET_PROFILE_PERMISSIONS_METHODS_FN,
            profileID
        );
        return queryRes.rows;
    }
}

// Singleton instance of the profile service
export default new ProfileService();