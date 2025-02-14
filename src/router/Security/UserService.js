// Service for the user object
import DatabaseManager from "../../components/database.js";
import {
    ASSIGN_PROFILE_PERMISSION_PROC,
    ASSIGN_USER_PROFILE_PROC,
    REVOKE_USER_PROFILE_PROC
} from "../../database/model/storedProcedures.js";
import {FieldFailError} from "@ralvarezdev/js-express";

export class UserService{
    // Assign a profile to a user
    async AssignUserProfile(req, body){
        let queryRes=await DatabaseManager.rawQuery(
            ASSIGN_USER_PROFILE_PROC,
            req.session.userID,
            body.username,
            body.profile_id,
            null,
            null
        );
        queryRes=queryRes.rows?.[0];

        if (queryRes?.out_is_profile_id_valid === false)
            throw new FieldFailError('profile_id', 'Profile ID is invalid');
        if (queryRes?.out_user_id === null)
            throw new FieldFailError('username', 'Username is invalid');
        return queryRes?.out_user_id
    }

    // Revoke a profile from a user
    async RevokeUserProfile(req, body){
        let queryRes=await DatabaseManager.rawQuery(
            REVOKE_USER_PROFILE_PROC,
            req.session.userID,
            body.username,
            body.profile_id,
            null,
            null
        );
        queryRes=queryRes.rows?.[0];

        if (queryRes?.out_is_profile_id_valid === false)
            throw new FieldFailError('profile_id', 'Profile ID is invalid');
        if (queryRes?.out_user_id === null)
            throw new FieldFailError('username', 'Username is invalid');
        return queryRes?.out_user_id
    }
}

// Singleton instance of the user service
export default new UserService();