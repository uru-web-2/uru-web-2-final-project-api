// Service for the user object
import DatabaseManager from "../../components/database.js";
import {
    ASSIGN_PROFILE_PERMISSION_PROC,
    ASSIGN_USER_PROFILE_PROC,
    REVOKE_USER_PROFILE_PROC
} from "../../database/model/storedProcedures.js";
import {FieldFailError} from "@ralvarezdev/js-express";
import * as constants from "node:constants";

export class UserService{
    // Assign a profile to a user
    async AssignUserProfile(req, body){
        const queryRes=await DatabaseManager.rawQuery(
            ASSIGN_USER_PROFILE_PROC,
            req.session.userID,
            body.username,
            body.profile_id,
            null,
            null
        );
        const queryRow=queryRes.rows?.[0];

        if (queryRow?.out_is_profile_id_valid === false)
            throw new FieldFailError('profile_id', 'Profile ID is invalid');
        if (queryRow?.out_user_id === null)
            throw new FieldFailError('username', 'Username is invalid');
        return queryRow?.out_user_id
    }

    // Revoke a profile from a user
    async RevokeUserProfile(req, body){
        const queryRes=await DatabaseManager.rawQuery(
            REVOKE_USER_PROFILE_PROC,
            req.session.userID,
            body.username,
            body.profile_id,
            null,
            null
        );
        const queryRow=queryRes.rows?.[0];

        if (queryRow?.out_is_profile_id_valid === false)
            throw new FieldFailError('profile_id', 'Profile ID is invalid');
        if (queryRow?.out_user_id === null)
            throw new FieldFailError('username', 'Username is invalid');
        return queryRow?.out_user_id
    }
}

// Singleton instance of the user service
export default new UserService();