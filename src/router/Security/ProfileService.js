// Query to assign a permission to a profile
export const ASSIGN_PROFILE_PERMISSION_PROC = "CALL assign_profile_permission($1, $2, $3, $4)"

// Query to revoke a permission from a profile
export const REVOKE_PROFILE_PERMISSION_PROC = "CALL revoke_profile_permission($1, $2, $3, $4)"

// Query to create a profile
export const CREATE_PROFILE_PROC = "CALL create_profile($1, $2, $3)"

// Query to update a profile
export const UPDATE_PROFILE_PROC = "CALL update_profile($1, $2, $3)"

// Query to delete a profile
export const DELETE_PROFILE_PROC = "CALL delete_profile($1, $2)"

// Query to gets the methods IDs and names from the permissions of a profile
export const GET_PROFILE_PERMISSIONS_METHODS_FN = "SELECT * FROM get_profile_permissions_methods($1)"