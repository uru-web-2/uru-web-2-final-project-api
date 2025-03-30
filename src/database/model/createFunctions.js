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
    WHERE modules.removed_at IS NULL;
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
    AND modules.removed_at IS NULL;
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
    WHERE objects.removed_at IS NULL;
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
    AND objects.removed_at IS NULL;
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
    AND objects.removed_at IS NULL;
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
    WHERE methods.removed_at IS NULL;
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
    AND methods.removed_at IS NULL;
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
    SELECT DISTINCT ON (methods.id) methods.id, methods.name, permissions.id IS NOT NULL AND permissions.removed_at IS NULL AS is_allowed
    FROM methods
    LEFT JOIN permissions ON methods.id = permissions.method_id
    AND permissions.profile_id = in_profile_id
    WHERE methods.object_id = in_object_id
    AND methods.removed_at IS NULL
    ORDER BY methods.id, permissions.id DESC;
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
    AND user_profiles.removed_at IS NULL;
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
    AND removed_at IS NULL;
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
    WHERE permissions.removed_at IS NULL;
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
    id BIGINT,
    first_name VARCHAR,
    last_name VARCHAR,
    email VARCHAR,
    username VARCHAR
) AS $$
BEGIN
    -- Query to select the user ID by username
    RETURN QUERY
    SELECT users.id, people.first_name, people.last_name, user_emails.email, user_usernames.username
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
    id BIGINT,
    name VARCHAR,
    description TEXT
) AS $$
BEGIN
    -- Query to select the profile ID by name
    RETURN QUERY
    SELECT profiles.id, profiles.name, profiles.description
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
    id BIGINT,
    name VARCHAR,
    description TEXT
) AS $$
BEGIN
    -- Query to select all profiles
    RETURN QUERY
    SELECT profiles.id, profiles.name, profiles.description
    FROM profiles
    WHERE profiles.removed_at IS NULL;
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
    id BIGINT,
    first_name VARCHAR,
    last_name VARCHAR,
    email VARCHAR,
    username VARCHAR
) AS $$
BEGIN
    -- Query to select all users with pagination
    RETURN QUERY
    SELECT users.id, people.first_name, people.last_name, user_emails.email, user_usernames.username
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
    WHERE topics.removed_at IS NULL;
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
    description TEXT
) AS $$
BEGIN
    -- Query to select all topics
    RETURN QUERY
    SELECT topics.id, topics.name, topics.description
    FROM topics
    WHERE topics.removed_at IS NULL;
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
    WHERE languages.removed_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets all the publishers
export const CREATE_GET_ALL_PUBLISHERS_FN = `
CREATE OR REPLACE FUNCTION get_all_publishers(
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR,
    description TEXT
) AS $$
BEGIN
    -- Query to select all publishers
    RETURN QUERY
    SELECT publishers.id, publishers.name, publishers.description
    FROM publishers
    WHERE publishers.removed_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that searches for a publisher by name
export const CREATE_SEARCH_PUBLISHER_BY_NAME_FN = `
CREATE OR REPLACE FUNCTION search_publisher_by_name(
    IN in_name VARCHAR,
    IN in_limit BIGINT
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR,
    description TEXT
) AS $$
BEGIN
    -- Query to select the publisher ID by name
    RETURN QUERY
    SELECT publishers.id, publishers.name, publishers.description
    FROM publishers
    WHERE publishers.name LIKE '%' || in_name || '%';
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that searches for a topic by name
export const CREATE_SEARCH_TOPIC_BY_NAME_FN = `
CREATE OR REPLACE FUNCTION search_topic_by_name(
    IN in_name VARCHAR,
    IN in_limit BIGINT
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR,
    description TEXT
) AS $$
BEGIN
    -- Query to select the topic ID by name
    RETURN QUERY
    SELECT topics.id, topics.name, topics.description
    FROM topics
    WHERE topics.name LIKE '%' || in_name || '%';
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets all the countries
export const CREATE_GET_ALL_COUNTRIES_FN = `
CREATE OR REPLACE FUNCTION get_all_countries(
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR
) AS $$
BEGIN
    -- Query to select all countries
    RETURN QUERY
    SELECT countries.id, countries.name
    FROM countries
    WHERE countries.removed_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that searches for a country by name
export const CREATE_SEARCH_COUNTRY_BY_NAME_FN = `
CREATE OR REPLACE FUNCTION search_country_by_name(
    IN in_name VARCHAR,
    IN in_limit BIGINT
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR
) AS $$
BEGIN
    -- Query to select the country ID by name
    RETURN QUERY
    SELECT countries.id, countries.name
    FROM countries
    WHERE countries.name LIKE '%' || in_name || '%';
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that searches for a language by name
export const CREATE_SEARCH_LANGUAGE_BY_NAME_FN = `
CREATE OR REPLACE FUNCTION search_language_by_name(
    IN in_name VARCHAR
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR
) AS $$
BEGIN
    -- Query to select the language ID by name
    RETURN QUERY
    SELECT languages.id, languages.name
    FROM languages
    WHERE languages.name LIKE '%' || in_name || '%';
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets all the locations
export const CREATE_GET_ALL_LOCATIONS_FN = `
CREATE OR REPLACE FUNCTION get_all_locations(
    in_limit BIGINT,
    in_offset BIGINT
) RETURNS
TABLE (
    id BIGINT,
    floor VARCHAR,
    area VARCHAR
) AS $$
BEGIN
    -- Query to select all locations
    RETURN QUERY
    SELECT locations.id, locations.floor, locations.area
    FROM locations
    WHERE locations.removed_at IS NULL
    ORDER BY locations.id
    OFFSET in_offset
    LIMIT in_limit;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets all the location sections
export const CREATE_GET_ALL_LOCATION_SECTIONS_FN = `
CREATE OR REPLACE FUNCTION get_all_location_sections(
    in_limit BIGINT,
    in_offset BIGINT
) RETURNS
TABLE (
    id BIGINT,
    location_id BIGINT,
    floor VARCHAR,
    area VARCHAR,
    name VARCHAR
) AS $$
BEGIN
    -- Query to select all location sections
    RETURN QUERY
    SELECT location_sections.id, location_sections.location_id, locations.floor, locations.area, location_sections.name
    FROM location_sections
    INNER JOIN locations ON location_sections.location_id = locations.id
    WHERE location_sections.removed_at IS NULL
    ORDER BY location_sections.id
    OFFSET in_offset
    LIMIT in_limit;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets all the location sections by location ID
export const CREATE_GET_LOCATION_SECTIONS_BY_LOCATION_ID_FN = `
CREATE OR REPLACE FUNCTION get_location_sections_by_location_id(
    in_location_id BIGINT
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR
) AS $$
BEGIN
    -- Query to select the location sections by location ID
    RETURN QUERY
    SELECT location_sections.id, location_sections.name
    FROM location_sections
    WHERE location_sections.location_id = in_location_id
    AND location_sections.removed_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets all the document topics by document ID
export const CREATE_GET_DOCUMENT_TOPICS_BY_DOCUMENT_ID_FN = `
CREATE OR REPLACE FUNCTION get_document_topics_by_document_id(
    in_document_id BIGINT
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR
) AS $$
BEGIN
    -- Query to select the document topics by document ID
    RETURN QUERY
    SELECT topics.id, topics.name
    FROM topics
    INNER JOIN document_topics ON topics.id = document_topics.topic_id
    WHERE document_topics.document_id = in_document_id
    AND topics.removed_at IS NULL
    AND document_topics.removed_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets all the document languages by document ID
export const CREATE_GET_DOCUMENT_LANGUAGES_BY_DOCUMENT_ID_FN = `
CREATE OR REPLACE FUNCTION get_document_languages_by_document_id(
    in_document_id BIGINT
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR
) AS $$
BEGIN
    -- Query to select the document languages by document ID
    RETURN QUERY
    SELECT languages.id, languages.name
    FROM languages
    INNER JOIN document_languages ON languages.id = document_languages.language_id
    WHERE document_languages.document_id = in_document_id
    AND languages.removed_at IS NULL
    AND document_languages.removed_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets all the document location sections by document ID
export const CREATE_GET_DOCUMENT_LOCATION_SECTIONS_BY_DOCUMENT_ID_FN = `
CREATE OR REPLACE FUNCTION get_document_location_sections_by_document_id(
    in_document_id BIGINT
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR
) AS $$
BEGIN
    -- Query to select the document location sections by document ID
    RETURN QUERY
    SELECT location_sections.id, location_sections.name
    FROM location_sections
    INNER JOIN document_location_sections ON location_sections.id = document_location_sections.location_section_id
    WHERE document_location_sections.document_id = in_document_id
    AND location_sections.removed_at IS NULL
    AND document_location_sections.removed_at IS NULL;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that gets all the magazines
export const CREATE_GET_ALL_MAGAZINES_FN = `
CREATE OR REPLACE FUNCTION get_all_magazines(
    IN in_limit BIGINT,
    IN in_offset BIGINT
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR,
    description TEXT,
    release_date DATE
) AS $$
BEGIN
    -- Query to select all magazines
    RETURN QUERY
    SELECT magazines.id, magazines.name, magazines.description, magazines.release_date
    FROM magazines
    WHERE magazines.removed_at IS NULL
    ORDER BY magazines.id
    OFFSET in_offset
    LIMIT in_limit;
END;
$$ LANGUAGE plpgsql;
`

// Query to create a function that searches for a magazine by name
export const CREATE_SEARCH_MAGAZINE_BY_NAME_FN = `
CREATE OR REPLACE FUNCTION search_magazine_by_name(
    IN in_name VARCHAR,
    IN in_limit BIGINT
) RETURNS
TABLE (
    id BIGINT,
    name VARCHAR,
    description TEXT,
    release_date DATE
) AS $$
BEGIN
    -- Query to select the magazine ID by name
    RETURN QUERY
    SELECT magazines.id, magazines.name, magazines.description, magazines.release_date
    FROM magazines
    WHERE magazines.name LIKE '%' || in_name || '%';
END;
$$ LANGUAGE plpgsql;
`
