import DatabaseManager from "../../components/database.js";
import {
    CREATE_USER_PROC,
    GET_NUMBER_OF_USERS_PROC,
    GET_USER_DETAILS_BY_USER_ID_PROC,
    UPDATE_USER_BY_ADMIN_PROC,
} from "../../database/model/storedProcedures.js";
import {FieldFailError} from "@ralvarezdev/js-express";
import {
    GET_ALL_USERS_FN,
    SEARCH_USER_BY_USERNAME_FN
} from "../../database/model/functions.js";
import {SALT_ROUNDS} from "../../components/bcrypt.js";
import bcrypt from "bcrypt";
import {PostgresIsUniqueConstraintError} from "@ralvarezdev/js-dbmanager";
import {
    IDENTITY_DOCUMENTS_UNIQUE_NUMBER,
    PASSPORTS_UNIQUE_NUMBER,
    USER_EMAILS_UNIQUE_EMAIL,
    USER_USERNAMES_UNIQUE_USERNAME
} from "../../database/model/constraints.js";

// Service for the user object
export class UserService {
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
            const queryRes = await DatabaseManager.rawQuery(CREATE_USER_PROC,
                body.first_name,
                body.last_name,
                body.username,
                body.email,
                body.password_hash,
                body.document_country,
                body.document_type,
                body.document_number,
                null,
                null
            )
            if (queryRes.rows.length > 0) {
                const isCountryValid = queryRes.rows[0]?.out_is_country_valid
                userID = queryRes.rows[0]?.out_user_id

                // Check if the country is valid
                if (!isCountryValid)
                    throw new FieldFailError(400,
                        "document_country",
                        "country not found"
                    )
            }

            return userID
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the username has already been registered
            if (constraintName === USER_USERNAMES_UNIQUE_USERNAME)
                throw new FieldFailError(400,
                    "username",
                    "username has already been registered"
                )

            // Check if the email has already been registered
            else if (constraintName === USER_EMAILS_UNIQUE_EMAIL)
                throw new FieldFailError(400,
                    "email",
                    "email has already been registered"
                )

            // Check if the identity document number or passport number has already been registered
            else if (constraintName === IDENTITY_DOCUMENTS_UNIQUE_NUMBER || constraintName === PASSPORTS_UNIQUE_NUMBER)
                throw new FieldFailError(400,
                    "document_number",
                    "document number has already been registered"
                )

            throw error
        }
    }

    // Get user details by user ID
    async GetUserDetailsByUserID(req, body) {
        const queryRes = await DatabaseManager.rawQuery(
            GET_USER_DETAILS_BY_USER_ID_PROC,
            body.id,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
        );
        return queryRes.rows[0]
    }

    // Get all users
    async GetAllUsers(req, body) {
        const usersRes = await DatabaseManager.rawQuery(
            GET_ALL_USERS_FN,
            body.offset,
            body.limit
        );

         const numberOfUsersQueryRes = await DatabaseManager.rawQuery(
            GET_NUMBER_OF_USERS_PROC,
            body.id
        );
        return {
            users: usersRes.rows,
            number_of_users: numberOfUsersQueryRes.rows[0]?.out_number_of_users
        }
    }

    // Update a user by admin
    async UpdateUserByAdmin(req, body) {
        // Update the user
        const queryRes = await DatabaseManager.rawQuery(
            UPDATE_USER_BY_ADMIN_PROC,
            req.session.userID,
            body.id,
            body.first_name,
            body.last_name,
            body.username,
            body.document_country,
            body.document_type,
            body.document_number,
            null
        );
        const queryRow = queryRes.rows?.[0];
        if (!queryRow?.out_country_name_is_valid)
            throw new FieldFailError(400,
                "document_country",
                "country not found"
            )
    }
}

// Singleton instance of the user service
export default new UserService();