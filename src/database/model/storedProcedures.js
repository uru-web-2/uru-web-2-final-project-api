// Query to get a country ID by name
export const GET_COUNTRY_ID_BY_NAME_PROC = "CALL get_country_id_by_name($1, $2)"

// Query to create a new user personal document
export const CREATE_USER_PERSONAL_DOCUMENT_PROC = "CALL create_user_personal_document($1, $2, $3, $4, $5)"

// Query to delete a user personal document
export const DELETE_USER_PERSONAL_DOCUMENT_PROC = "CALL delete_user_personal_document($1, $2, $3)"

// Query to replace a user personal document
export const REPLACE_USER_PERSONAL_DOCUMENT_PROC = "CALL replace_user_personal_document($1, $2, $3, $4, $5)"

// Query to create a new person
export const CREATE_PERSON_PROC = "CALL create_person($1, $2, $3, $4, $5, $6, $7)"

// Query to create a new user email
export const CREATE_USER_EMAIL_PROC = "CALL create_user_email($1, $2, $3, $4, $5)"

// Query to update a user email
export const UPDATE_USER_EMAIL_PROC = "CALL update_user_email($1, $2, $3, $4, $5)"

// Query to revoke a user email verification token by user email ID
export const REVOKE_USER_EMAIL_VERIFICATION_TOKEN_BY_USER_EMAIL_ID_PROC = "CALL revoke_user_email_verification_token_by_user_email_id($1)"

// Query to create a new user email verification token
export const CREATE_USER_EMAIL_VERIFICATION_TOKEN_PROC = "CALL create_user_email_verification_token($1, $2, $3, $4)"

// Query to get the user email information by user ID
export const GET_USER_EMAIL_INFO_BY_USER_ID_PROC = "CALL get_user_email_info_by_user_id($1, $2, $3, $4, $5)"

// Query to get the user email information by user email
export const GET_USER_EMAIL_INFO_BY_USER_EMAIL_PROC = "CALL get_user_email_info_by_user_email($1, $2, $3, $4, $5)"

// Query to verify a user email verification token
export const VERIFY_USER_EMAIL_VERIFICATION_TOKEN_PROC = "CALL verify_user_email_verification_token($1, $2)"

// Query to revoke a user reset password token by user ID
export const REVOKE_USER_RESET_PASSWORD_TOKEN_BY_USER_ID_PROC = "CALL revoke_user_reset_password_token_by_user_id($1)"

// Query to update a user password
export const UPDATE_USER_PASSWORD_HASH_PROC = "CALL update_user_password_hash($1, $2)"

// Query to create a new user reset password token
export const CREATE_USER_RESET_PASSWORD_TOKEN_PROC = "CALL create_user_reset_password_token($1, $2, $3)"

// Query to reset a user password


// Query to create a new user
export const CREATE_USER_PROC = "CALL create_user($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)"

// Query to log in a user
export const LOG_IN_PROC = "CALL log_in($1, $2, $3, $4)"

// Query to get the user ID by username
export const GET_USER_ID_BY_USERNAME_PROC = "CALL get_user_id_by_username($1, $2)"

// Query to assign a profile to a user
export const ASSIGN_USER_PROFILE_PROC = "CALL assign_user_profile($1, $2, $3, $4, $5)"

// Query to revoke a profile from a user
export const REVOKE_USER_PROFILE_PROC = "CALL revoke_user_profile($1, $2, $3, $4, $5)"

// Query to assign a permission to a profile
export const ASSIGN_PROFILE_PERMISSION_PROC = "CALL assign_profile_permission($1, $2, $3, $4, $5, $6)"

// Query to revoke a permission from a profile
export const REVOKE_PROFILE_PERMISSION_PROC = "CALL revoke_profile_permission($1, $2, $3, $4, $5, $6)"

// Query to create a profile
export const CREATE_PROFILE_PROC = "CALL create_profile($1, $2, $3)"

// Query to update a profile
export const UPDATE_PROFILE_PROC = "CALL update_profile($1, $2, $3, $4)"

// Query to delete a profile
export const DELETE_PROFILE_PROC = "CALL delete_profile($1, $2, $3)"

// Query to create a new module
export const CREATE_MODULE_PROC = "CALL create_module($1, $2, $3, $4)"

// Query to create a new object
export const CREATE_OBJECT_PROC = "CALL create_object($1, $2, $3, $4)"

// Query to create a new method
export const CREATE_METHOD_PROC = "CALL create_method($1, $2, $3, $4)"

// Query to delete all modules
export const DELETE_ALL_MODULES_PROC = "CALL delete_all_modules($1)"

// Query to create a new method with the profiles for the permissions
export const CREATE_METHOD_WITH_PROFILES_PROC = "CALL create_method_with_profiles($1, $2, $3, $4, $5)"

// Query to get the module ID by name
export const GET_MODULE_ID_BY_NAME_PROC = "CALL get_module_id_by_name($1, $2)"

// Query to get the object ID by name
export const GET_OBJECT_ID_BY_NAME_PROC = "CALL get_object_id_by_name($1, $2)"

// Query to get the method ID by name
export const GET_METHOD_ID_BY_NAME_PROC = "CALL get_method_id_by_name($1, $2)"

// Query to get the number of users
export const GET_NUMBER_OF_USERS_PROC = "CALL get_number_of_users($1)"

// Query to update a user username
export const UPDATE_USER_USERNAME_PROC = "CALL update_user_username($1, $2)"

// Query to update a user by admin
export const UPDATE_USER_BY_ADMIN_PROC = "CALL update_user_by_admin($1, $2, $3, $4, $5, $6, $7, $8, $9)"