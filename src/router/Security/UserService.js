import DatabaseManager from "../../components/database.js";
import {
    ASSIGN_USER_PROFILE_PROC, CREATE_USER_PROC,
    REVOKE_USER_PROFILE_PROC
} from "../../database/model/storedProcedures.js";
import {FieldFailError, HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import {SEARCH_USER_BY_USERNAME_FN} from "../../database/model/functions.js";
import Logger from "../../components/logger.js";
import {SALT_ROUNDS} from "../../components/bcrypt.js";
import bcrypt from "bcrypt";
import {PostgresIsUniqueConstraintError} from "@ralvarezdev/js-dbmanager";
import {
    IDENTITY_DOCUMENTS_UNIQUE_NUMBER, PASSPORTS_UNIQUE_NUMBER,
    USER_EMAILS_UNIQUE_EMAIL,
    USER_USERNAMES_UNIQUE_USERNAME
} from "../../database/model/constraints.js";

// Service for the user object
export class UserService {
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
            throw new FieldFailError('profile_id', 'Profile ID is invalid');
        if (queryRow?.out_user_id === null)
            throw new FieldFailError('username', 'Username is invalid');
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
            throw new FieldFailError('profile_id', 'Profile ID is invalid');
        if (queryRow?.out_user_id === null)
            throw new FieldFailError('username', 'Username is invalid');
        return queryRow?.out_user_id
    }

    // Search for a user by username
    async SearchUserByUsername(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            SEARCH_USER_BY_USERNAME_FN,
            body.username
        );
        return queryRes.rows;
    }

    // Create a user
    async CreateUser(req, body) {
        try {
            // Hash the password
            body.password_hash = bcrypt.hashSync(req.body.password, SALT_ROUNDS)

             // Create the user
            let userID
            const queryRes = await DatabaseManager.rawQuery(CREATE_USER_PROC, body.first_name, body.last_name, body.username, body.email, body.password_hash, body.document_country, body.document_type, body.document_number, null, null)
            if (queryRes.rows.length > 0) {
                const isCountryValid = queryRes.rows[0]?.out_is_country_valid
                userID = queryRes.rows[0]?.out_user_id

                // Check if the country is valid
                if (!isCountryValid)
                    throw new FieldFailError(400, "document_country", "country not found")
            }

            return userID
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the username has already been registered
            if (constraintName === USER_USERNAMES_UNIQUE_USERNAME)
                throw new FieldFailError(400, "username", "username has already been registered")

            // Check if the email has already been registered
            else if (constraintName === USER_EMAILS_UNIQUE_EMAIL)
                throw new FieldFailError(400, "email", "email has already been registered")

            // Check if the identity document number or passport number has already been registered
            else if (constraintName === IDENTITY_DOCUMENTS_UNIQUE_NUMBER || constraintName === PASSPORTS_UNIQUE_NUMBER)
                throw new FieldFailError(400, "document_number", "document number has already been registered")

            throw error
        }
    }
}

// Singleton instance of the user service
export default new UserService();