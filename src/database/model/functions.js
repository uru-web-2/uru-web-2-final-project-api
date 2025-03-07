// Query to get the modules
export const GET_MODULES_FN = "SELECT * FROM get_modules()"

// Query to get the objects
export const GET_OBJECTS_FN = "SELECT * FROM get_objects()"

// Query to get the methods
export const GET_METHODS_FN = "SELECT * FROM get_methods()"

// Query to gets the users profiles
export const GET_USER_PROFILES_FN = "SELECT * FROM get_user_profiles($1)"

// Query to gets the methods IDs and names from the permissions of a profile
export const GET_PROFILE_PERMISSIONS_METHODS_FN = "SELECT * FROM get_profile_permissions_methods($1)"

// Query to create a function that gets the profiles IDs and names
export const GET_PROFILES_FN = "SELECT * FROM get_profiles()"

// Query to create a function that gets the permissions
export const GET_PERMISSIONS_FN = "SELECT * FROM get_permissions()"

// Query to create a function that searches for a user by username
export const SEARCH_USER_BY_USERNAME_FN = "SELECT * FROM search_user_by_username($1)"

// Query to create a function that searches for a profile by name
export const SEARCH_PROFILE_BY_NAME_FN = "SELECT * FROM search_profile_by_name($1)"