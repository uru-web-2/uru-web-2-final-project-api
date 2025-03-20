import DatabaseManager from "../../components/database.js";
import {FieldFailError} from "@ralvarezdev/js-express";
import {
    ASSIGN_PROFILE_PERMISSION_PROC,
    ASSIGN_USER_PROFILE_PROC,
    REVOKE_PROFILE_PERMISSION_PROC,
    REVOKE_USER_PROFILE_PROC,
    SET_PROFILE_PERMISSIONS_PROC,
} from "../../database/model/storedProcedures.js";
import {
    GET_ALL_MODULES_FN,
    GET_METHODS_BY_OBJECT_ID_FN,
    GET_METHODS_BY_PROFILE_ID_OBJECT_ID_FN,
    GET_OBJECTS_BY_MODULE_ID_FN,
    GET_PROFILE_PERMISSIONS_METHODS_FN
} from "../../database/model/functions.js";
import Security from "../../components/security.js";

// Service for the security object
export class SecurityService {
    // Assigns a permission to a profile
    async AssignProfilePermission(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            ASSIGN_PROFILE_PERMISSION_PROC,
            req.session.userID,
            body.profile_id,
            body.method_id,
            null,
            null,
            null
        );
        const queryRow = queryRes.rows?.[0];

        if (queryRow?.out_is_profile_id_valid === false)
            throw new FieldFailError('profile_id', 'Profile ID is invalid');
        if (queryRow?.out_is_method_id_valid === false)
            throw new FieldFailError('method_id', 'Method ID is invalid');

        // Add the permission ID to the security component
        Security.addPermission(body.profile_id, body.method_id)

        return queryRow?.out_permission_id;
    }

    // Revokes a permission from a profile
    async RevokeProfilePermission(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            REVOKE_PROFILE_PERMISSION_PROC,
            req.session.userID,
            body.profile_id,
            body.method_id,
            null,
            null,
            null
        );
        const queryRow = queryRes.rows?.[0];

        if (queryRow?.out_is_profile_id_valid === false)
            throw new FieldFailError(400,
                'profile_id',
                'Profile ID is invalid'
            );
        if (queryRow?.out_is_method_id_valid === false)
            throw new FieldFailError(400, 'method_id', 'Method ID is invalid');

        // Remove the permission ID from the security component
        Security.removePermission(body.profile_id, body.method_id)

        return queryRow?.out_permission_id;
    }

    // Gets the methods IDs and names from the permissions of a profile
    async GetProfilePermissionsMethods(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            GET_PROFILE_PERMISSIONS_METHODS_FN,
            body.profile_id,
            body.module_id,
            body.object_id
        );
        return queryRes.rows;
    }

    // Get all modules
    async GetModules(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            GET_ALL_MODULES_FN,
        );
        return queryRes.rows;
    }

    // Get all objects by module ID
    async GetObjectsByModuleID(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            GET_OBJECTS_BY_MODULE_ID_FN,
            body.module_id
        );
        return queryRes.rows;
    }

    // Get all methods by object ID
    async GetMethodsByObjectID(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            GET_METHODS_BY_OBJECT_ID_FN,
            body.object_id
        );
        return queryRes.rows;
    }

    // Assign a profile to a user
    async AssignUserProfile(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            ASSIGN_USER_PROFILE_PROC,
            req.session.userID,
            body.username,
            body.profile_id,
            null,
            null
        );
        const queryRow = queryRes.rows?.[0];

        if (queryRow?.out_is_profile_id_valid === false)
            throw new FieldFailError(400,
                'profile_id',
                'Profile ID is invalid'
            );
        if (queryRow?.out_user_id === null)
            throw new FieldFailError(400, 'username', 'Username is invalid');
        return queryRow?.out_user_id
    }

    // Revoke a profile from a user
    async RevokeUserProfile(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            REVOKE_USER_PROFILE_PROC,
            req.session.userID,
            body.username,
            body.profile_id,
            null,
            null
        );
        const queryRow = queryRes.rows?.[0];

        if (queryRow?.out_is_profile_id_valid === false)
            throw new FieldFailError(400,
                'profile_id',
                'Profile ID is invalid'
            );
        if (queryRow?.out_user_id === null)
            throw new FieldFailError(400, 'username', 'Username is invalid');
        return queryRow?.out_user_id
    }

    // Get methods by profile ID and object ID
    async GetMethodsByProfileIDObjectID(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            GET_METHODS_BY_PROFILE_ID_OBJECT_ID_FN,
            body.profile_id,
            body.object_id
        );
        return queryRes.rows;
    }

    // Set profile permissions
    async SetProfilePermissions(req, body) {
        await DatabaseManager.rawQuery(
            SET_PROFILE_PERMISSIONS_PROC,
            req.session.userID,
            body.profile_id,
            body.assign_method_ids,
            body.revoke_method_ids,
        )
    }
}

// Singleton instance of the security service
export default new SecurityService();