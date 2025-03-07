// Query to create a function that gets the modules
export const CREATE_GET_MODULES_FN = `
CREATE OR REPLACE FUNCTION get_modules(
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

// Query to create a function that gets the objects
export const CREATE_GET_OBJECTS_FN = `
CREATE OR REPLACE FUNCTION get_objects(
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

// Query to create a function that gets the methods
export const CREATE_GET_METHODS_FN = `
CREATE OR REPLACE FUNCTION get_methods(
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

// Query to create a function that gets the user profiles
export const CREATE_GET_USER_PROFILES_FN = `
CREATE OR REPLACE FUNCTION get_user_profiles(
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
    INNER JOIN user_profiles
    ON profiles.id = user_profiles.profile_id
    WHERE user_profiles.user_id = in_user_id
    AND user_profiles.revoked_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Create a function that gets the methods IDs and names from the permissions of a profile
export const CREATE_GET_PROFILE_PERMISSIONS_METHODS_FN = `
CREATE OR REPLACE FUNCTION get_profile_permissions_methods(
    IN in_profile_id BIGINT
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
    INNER JOIN methods
    ON permissions.method_id = methods.id
    WHERE profile_id = in_profile_id
    AND revoked_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Create a function that gets the profiles IDs and names
export const CREATE_GET_PROFILES_FN = `
CREATE OR REPLACE FUNCTION get_profiles(
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR
) AS $$
BEGIN
    -- Query to select the profiles IDs and names
    RETURN QUERY
    SELECT profiles.id, profiles.name
    FROM profiles
    WHERE profiles.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets the permissions
export const CREATE_GET_PERMISSIONS_FN = `
CREATE OR REPLACE FUNCTION get_permissions(
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
) AS $$
BEGIN
    -- Query to select the user ID by username
    RETURN QUERY
    SELECT users.id AS user_id, people.first_name AS user_first_name, people.last_name AS user_last_name, user_emails.email AS user_email, user_usernames.username AS user_username
    FROM users
    INNER JOIN people
    ON users.person_id = people.id
    INNER JOIN user_emails
    ON users.id = user_emails.user_id
    INNER JOIN user_usernames
    ON users.id = user_usernames.user_id
    WHERE user_usernames.username LIKE in_username;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that searches for a profile by name
export const CREATE_SEARCH_PROFILE_BY_NAME_FN = `
CREATE OR REPLACE FUNCTION search_profile_by_name(
    IN in_name VARCHAR
) AS $$
BEGIN
    -- Query to select the profile ID by name
    RETURN QUERY
    SELECT profiles.id AS profile_id, profiles.name AS profile_name, profiles.description AS profile_description INTO out_profile_id, out_profile_name, out_profile_description
    FROM profiles
    WHERE profiles.name LIKE in_name
END;
$$ LANGUAGE plpgsql;
`


