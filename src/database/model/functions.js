// Query to get all the modules
export const GET_ALL_MODULES_FN = "SELECT * FROM get_all_modules()"

// Query to get the modules by profile ID
export const GET_MODULES_BY_PROFILE_ID_FN = "SELECT * FROM get_modules_by_profile_id($1)"

// Query to get all the objects
export const GET_ALL_OBJECTS_FN = "SELECT * FROM get_all_objects()"

// Query to get the objects by module ID
export const GET_OBJECTS_BY_MODULE_ID_FN = "SELECT * FROM get_objects_by_module_id($1)"

// Query to get the objects by profile ID and module ID
export const GET_OBJECTS_BY_PROFILE_ID_MODULE_ID_FN = "SELECT * FROM get_objects_by_profile_id_module_id($1, $2)"

// Query to get all the methods
export const GET_ALL_METHODS_FN = "SELECT * FROM get_all_methods()"

// Query to get the methods by object ID
export const GET_METHODS_BY_OBJECT_ID_FN = "SELECT * FROM get_methods_by_object_id($1)"

// Query to get all the methods by profile ID and object ID
export const GET_METHODS_BY_PROFILE_ID_OBJECT_ID_FN = "SELECT * FROM get_methods_by_profile_id_object_id($1, $2)"

// Query to get the users profiles
export const GET_ALL_USER_PROFILES_FN = "SELECT * FROM get_all_user_profiles($1)"

// Query to get the methods IDs and names from the permissions of a profile
export const GET_PROFILE_PERMISSIONS_METHODS_FN = "SELECT * FROM get_profile_permissions_methods($1, $2, $3)"

// Query to get all the permissions
export const GET_ALL_PERMISSIONS_FN = "SELECT * FROM get_all_permissions()"

// Query to search for a user by username
export const SEARCH_USER_BY_USERNAME_FN = "SELECT * FROM search_user_by_username($1, $2)"

// Query to search for a profile by name
export const SEARCH_PROFILE_BY_NAME_FN = "SELECT * FROM search_profile_by_name($1)"

// Query to get all the profiles
export const GET_ALL_PROFILES_FN = "SELECT * FROM get_all_profiles()"

// Query to get all the users with pagination
export const GET_ALL_USERS_FN = "SELECT * FROM get_all_users($1, $2)"

// Query to get all the topics name
export const GET_ALL_TOPICS_NAME_FN = "SELECT * FROM get_all_topics_name()"

// Query to get all the topics
export const GET_ALL_TOPICS_FN = "SELECT * FROM get_all_topics()"

// Query to get all the languages
export const GET_ALL_LANGUAGES_FN = "SELECT * FROM get_all_languages()"

// Query to get all the publishers
export const GET_ALL_PUBLISHERS_FN = "SELECT * FROM get_all_publishers()"

// Query to search for a publisher by name
export const SEARCH_PUBLISHER_BY_NAME_FN = "SELECT * FROM search_publisher_by_name($1)"

// Query to search for a topic by name
export const SEARCH_TOPIC_BY_NAME_FN = "SELECT * FROM search_topic_by_name($1)"

// Query to search for a language by name
export const SEARCH_LANGUAGE_BY_NAME_FN = "SELECT * FROM search_language_by_name($1)"

// Query to get all the countries
export const GET_ALL_COUNTRIES_FN = "SELECT * FROM get_all_countries()"

// Query to search for a country by name
export const SEARCH_COUNTRY_BY_NAME_FN = "SELECT * FROM search_country_by_name($1)"

// Query to get all the locations
export const GET_ALL_LOCATIONS_FN = "SELECT * FROM get_all_locations($1, $2)"