// Query to signups a user
export const SIGN_UP_PROC = "CALL sign_up($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)"

// Query to log in a user
export const LOG_IN_PROC = "CALL log_in($1, $2, $3)"

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

// Query to create a module
export const CREATE_MODULE_PROC = "CALL create_module($1, $2, $3, $4)"

// Query to create an object
export const CREATE_OBJECT_PROC = "CALL create_object($1, $2, $3, $4)"

// Query to create a method
export const CREATE_METHOD_PROC = "CALL create_method($1, $2, $3, $4)"

// Query to delete all modules
export const DELETE_ALL_MODULES_PROC = "CALL delete_all_modules($1)"

// Query to create a method with the profiles for the permissions
export const CREATE_METHOD_WITH_PROFILES_PROC = "CALL create_method_with_profiles($1, $2, $3, $4, $5)"