// Query to create a function that loads the modules
export const CREATE_LOAD_MODULES_FN = `
CREATE OR REPLACE FUNCTION load_modules(
) RETURNS
TABLE (
    name VARCHAR,
    parent_module_id BIGINT
) AS $$
BEGIN
    -- Query to select all modules
    RETURN QUERY
    SELECT id, name, parent_module_id
    FROM modules
    WHERE deleted_at IS NULL
    ORDER BY id;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that loads the objects
export const CREATE_LOAD_OBJECTS_FN = `
CREATE OR REPLACE FUNCTION load_objects(
) RETURNS
TABLE (
    name VARCHAR,
    module_id BIGINT
) AS $$
BEGIN
    -- Query to select all objects
    RETURN QUERY
    SELECT id, name, module_id
    FROM objects
    WHERE deleted_at IS NULL
    ORDER BY id;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that loads the methods
export const CREATE_LOAD_METHODS_FN = `
CREATE OR REPLACE FUNCTION load_methods(
) RETURNS
TABLE (
    name VARCHAR,
    object_id BIGINT
) AS $$
BEGIN
    -- Query to select all methods
    RETURN QUERY
    SELECT id, name, object_id
    FROM methods
    WHERE deleted_at IS NULL
    ORDER BY id;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that loads the profiles
export const CREATE_LOAD_PROFILES_FN = `
CREATE OR REPLACE FUNCTION load_profiles(
) RETURNS
TABLE (
    name VARCHAR
) AS $$
BEGIN
    -- Query to select all profiles
    RETURN QUERY
    SELECT id, name
    FROM profiles
    WHERE deleted_at IS NULL
    ORDER BY id;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that loads the permissions
export const CREATE_LOAD_PERMISSIONS_FN = `
CREATE OR REPLACE FUNCTION load_permissions(
) RETURNS
TABLE (
     method_id BIGINT,
     profile_id BIGINT
) AS $$
BEGIN
    -- Query to select all permissions
    RETURN QUERY
    SELECT method_id, profile_id
    FROM permissions
    WHERE revoked_at IS NULL
    ORDER BY id;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets the user profiles
export const CREATE_GET_USER_PROFILES_FN = `
CREATE OR REPLACE FUNCTION get_user_profiles(
    IN in_user_id BIGINT
) RETURNS
TABLE (
    name VARCHAR
) AS $$
BEGIN
    -- Query to select all user profiles
    RETURN QUERY
    SELECT profiles.name AS name
    FROM user_profiles
    INNER JOIN profiles
    ON user_profiles.profile_id = profiles.id
    WHERE user_id = in_user_id
    AND revoked_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`