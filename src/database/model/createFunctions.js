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
    name VARCHAR,
    object_id BIGINT
) AS $$
BEGIN
    -- Query to select the methods by object ID
    RETURN QUERY
    SELECT methods.id, methods.name, methods.object_id
    FROM methods
    WHERE methods.object_id = in_object_id
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
    IN in_username VARCHAR
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
    WHERE user_usernames.username LIKE in_username;
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
    WHERE profiles.name LIKE in_name;
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

// Query to create a function that gets the user details by user ID
export const CREATE_GET_USER_DETAILS_BY_USER_ID_FN = `
CREATE OR REPLACE FUNCTION get_user_details_by_user_id(
    IN in_user_id BIGINT
) RETURNS
TABLE (
    user_id BIGINT,
    user_first_name VARCHAR,
    user_last_name VARCHAR,
    user_email VARCHAR,
    user_username VARCHAR,
    user_birthdate DATE,
    user_profile_ids BIGINT[]
) AS $$
BEGIN
    -- Query to select the user details by user ID
    RETURN QUERY
    SELECT users.id AS user_id, people.first_name AS user_first_name, people.last_name AS user_last_name, user_emails.email AS user_email, user_usernames.username AS user_username, people.birthdate AS user_birthdate, ARRAY(SELECT profile_id FROM user_profiles WHERE user_id = in_user_id AND revoked_at IS NULL) AS user_profile_ids
    FROM users
    INNER JOIN people
    ON users.person_id = people.id
    INNER JOIN user_emails
    ON users.id = user_emails.user_id
    INNER JOIN user_usernames
    ON users.id = user_usernames.user_id
    WHERE users.id = in_user_id;
END;
$$ LANGUAGE plpgsql;
`