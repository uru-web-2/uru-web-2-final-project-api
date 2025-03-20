// Query to create a function that gets all the modules
export const CREATE_GET_ALL_MODULES_FN = `
CREATE OR REPLACE FUNCTION get_all_modules(
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR,
    parent_module_id BIGINT
) AS $$
BEGIN
    -- Query to select all modules
    RETURN QUERY
    SELECT modules.id, modules.name, modules.parent_module_id
    FROM modules
    WHERE modules.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets all the modules by profile ID
export const CREATE_GET_MODULES_BY_PROFILE_ID_FN = `
CREATE OR REPLACE FUNCTION get_modules_by_profile_id(
    IN in_profile_id BIGINT
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR,
    parent_module_id BIGINT
) AS $$
BEGIN
    -- Query to select the modules by profile ID
    RETURN QUERY
    SELECT modules.id, modules.name, modules.parent_module_id
    FROM modules
    INNER JOIN objects ON modules.id = objects.module_id
    INNER JOIN methods ON objects.id = methods.object_id
    INNER JOIN permissions ON methods.id = permissions.method_id
    WHERE permissions.profile_id = in_profile_id
    AND modules.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets all the objects
export const CREATE_GET_ALL_OBJECTS_FN = `
CREATE OR REPLACE FUNCTION get_all_objects(
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR,
    module_id BIGINT
) AS $$
BEGIN
    -- Query to select all objects
    RETURN QUERY
    SELECT objects.id, objects.name, objects.module_id
    FROM objects
    WHERE objects.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets the objects by module ID
export const CREATE_GET_OBJECTS_BY_MODULE_ID_FN = `
CREATE OR REPLACE FUNCTION get_objects_by_module_id(
    IN in_module_id BIGINT  
) RETURNS
TABLE (
    id BIGINT,  
    name VARCHAR,
    module_id BIGINT
) AS $$
BEGIN
    -- Query to select the objects by module ID
    RETURN QUERY
    SELECT objects.id, objects.name, objects.module_id
    FROM objects
    WHERE objects.module_id = in_module_id
    AND objects.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets all the objects by profile ID and module ID
export const CREATE_GET_OBJECTS_BY_PROFILE_ID_MODULE_ID_FN = `
CREATE OR REPLACE FUNCTION get_objects_by_profile_id_module_id(
    IN in_profile_id BIGINT,
    IN in_module_id BIGINT
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR,
    module_id BIGINT
) AS $$
BEGIN
    -- Query to select the objects by profile ID and module ID
    RETURN QUERY
    SELECT objects.id, objects.name, objects.module_id
    FROM objects
    INNER JOIN methods ON objects.id = methods.object_id
    INNER JOIN permissions ON methods.id = permissions.method_id
    WHERE permissions.profile_id = in_profile_id
    AND objects.module_id = in_module_id
    AND objects.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets all the methods
export const CREATE_GET_ALL_METHODS_FN = `
CREATE OR REPLACE FUNCTION get_all_methods(
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR,
    object_id BIGINT
) AS $$
BEGIN
    -- Query to select all methods
    RETURN QUERY
    SELECT methods.id, methods.name, methods.object_id
    FROM methods
    WHERE methods.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets the methods by object ID
export const CREATE_GET_METHODS_BY_OBJECT_ID_FN = `
CREATE OR REPLACE FUNCTION get_methods_by_object_id(
    IN in_object_id BIGINT
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR
) AS $$
BEGIN
    -- Query to select the methods by object ID
    RETURN QUERY
    SELECT methods.id, methods.name
    FROM methods
    WHERE methods.object_id = in_object_id
    AND methods.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets all the methods by profile ID and object ID
export const CREATE_GET_METHODS_BY_PROFILE_ID_OBJECT_ID_FN = `
CREATE OR REPLACE FUNCTION get_methods_by_profile_id_object_id(
    IN in_profile_id BIGINT,
    IN in_object_id BIGINT
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR,
    is_allowed BOOLEAN
) AS $$
BEGIN
    -- Query to select the methods by profile ID and object ID
    RETURN QUERY
    SELECT methods.id, methods.name, permissions.id IS NOT NULL AS is_allowed
    FROM methods
    LEFT JOIN permissions ON methods.id = permissions.method_id
    WHERE permissions.profile_id = in_profile_id
    AND methods.object_id = in_object_id
    AND methods.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets all the user profiles
export const CREATE_GET_ALL_USER_PROFILES_FN = `
CREATE OR REPLACE FUNCTION get_all_user_profiles(
    IN in_user_id BIGINT
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR
) AS $$
BEGIN
    -- Query to select all user profiles
    RETURN QUERY
    SELECT profiles.id, profiles.name
    FROM profiles
    INNER JOIN user_profiles ON profiles.id = user_profiles.profile_id
    WHERE user_profiles.user_id = in_user_id
    AND user_profiles.revoked_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Create a function that gets the methods IDs and names from the permissions of a profile
export const CREATE_GET_PROFILE_PERMISSIONS_METHODS_FN = `
CREATE OR REPLACE FUNCTION get_profile_permissions_methods(
    IN in_profile_id BIGINT,
    IN in_module_id BIGINT,
    IN in_object_id BIGINT
) RETURNS
TABLE (
    method_id BIGINT,
    method_name VARCHAR
) AS $$
BEGIN
    -- Query to select the methods IDs and names
    RETURN QUERY
    SELECT methods.id, methods.name
    FROM permissions
    INNER JOIN methods ON permissions.method_id = methods.id
    INNER JOIN objects ON methods.object_id = objects.id
    WHERE permissions.profile_id = in_profile_id
    AND objects.module_id = in_module_id
    AND profile_id = in_profile_id
    AND object_id = in_object_id
    AND module_id = in_module_id
    AND revoked_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets all the permissions
export const CREATE_GET_ALL_PERMISSIONS_FN = `
CREATE OR REPLACE FUNCTION get_all_permissions(
) RETURNS
TABLE (
     method_id BIGINT,
     profile_id BIGINT
) AS $$
BEGIN
    -- Query to select all permissions
    RETURN QUERY
    SELECT permissions.method_id, permissions.profile_id
    FROM permissions
    WHERE permissions.revoked_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that searches for a user by username
export const CREATE_SEARCH_USER_BY_USERNAME_FN = `
CREATE OR REPLACE FUNCTION search_user_by_username(
    IN in_username VARCHAR,
    IN in_limit BIGINT
) RETURNS
TABLE (
    user_id BIGINT,
    user_first_name VARCHAR,
    user_last_name VARCHAR,
    user_email VARCHAR,
    user_username VARCHAR
) AS $$
BEGIN
    -- Query to select the user ID by username
    RETURN QUERY
    SELECT users.id AS user_id, people.first_name AS user_first_name, people.last_name AS user_last_name, user_emails.email AS user_email, user_usernames.username AS user_username
    FROM users
    INNER JOIN people ON users.person_id = people.id
    INNER JOIN user_emails ON users.id = user_emails.user_id
    INNER JOIN user_usernames ON users.id = user_usernames.user_id
    WHERE user_usernames.username LIKE '%' || in_username || '%'
    LIMIT in_limit;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that searches for a profile by name
export const CREATE_SEARCH_PROFILE_BY_NAME_FN = `
CREATE OR REPLACE FUNCTION search_profile_by_name(
    IN in_name VARCHAR
) RETURNS
TABLE (
    profile_id BIGINT,
    profile_name VARCHAR,
    profile_description VARCHAR
) AS $$
BEGIN
    -- Query to select the profile ID by name
    RETURN QUERY
    SELECT profiles.id AS profile_id, profiles.name AS profile_name, profiles.description AS profile_description
    FROM profiles
    WHERE profiles.name LIKE '%' || in_name || '%';
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets all the profiles
export const CREATE_GET_ALL_PROFILES_FN = `
CREATE OR REPLACE FUNCTION get_all_profiles(
) RETURNS
TABLE (
    profile_id BIGINT,
    profile_name VARCHAR,
    profile_description VARCHAR
) AS $$
BEGIN
    -- Query to select all profiles
    RETURN QUERY
    SELECT profiles.id AS profile_id, profiles.name AS profile_name, profiles.description AS profile_description
    FROM profiles
    WHERE profiles.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets all the users with pagination
export const CREATE_GET_ALL_USERS_FN = `
CREATE OR REPLACE FUNCTION get_all_users(
    IN in_offset BIGINT,
    IN in_limit BIGINT
) RETURNS
TABLE (
    user_id BIGINT,
    user_first_name VARCHAR,
    user_last_name VARCHAR,
    user_email VARCHAR,
    user_username VARCHAR
) AS $$
BEGIN
    -- Query to select all users with pagination
    RETURN QUERY
    SELECT users.id AS user_id, people.first_name AS user_first_name, people.last_name AS user_last_name, user_emails.email AS user_email, user_usernames.username AS user_username
    FROM users
    INNER JOIN people ON users.person_id = people.id
    INNER JOIN user_emails ON users.id = user_emails.user_id
    INNER JOIN user_usernames ON users.id = user_usernames.user_id
    ORDER BY users.id
    OFFSET in_offset
    LIMIT in_limit;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets all the topics name
export const CREATE_GET_ALL_TOPICS_NAME_FN = `
CREATE OR REPLACE FUNCTION get_all_topics_name(
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR
) AS $$
BEGIN
    -- Query to select all topics
    RETURN QUERY
    SELECT topics.id, topics.name
    FROM topics
    WHERE topics.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets all the topics
export const CREATE_GET_ALL_TOPICS_FN = `
CREATE OR REPLACE FUNCTION get_all_topics(
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR,
    description VARCHAR
) AS $$
BEGIN
    -- Query to select all topics
    RETURN QUERY
    SELECT topics.id, topics.name, topics.description
    FROM topics
    WHERE topics.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets all the languages
export const CREATE_GET_ALL_LANGUAGES_FN = `
CREATE OR REPLACE FUNCTION get_all_languages(
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR
) AS $$
BEGIN
    -- Query to select all languages
    RETURN QUERY
    SELECT languages.id, languages.name
    FROM languages
    WHERE languages.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`