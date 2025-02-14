// CreateSignUpProc is a stored procedure that creates a new user in the database
export const CREATE_SIGN_UP_PROC = `
CREATE OR REPLACE PROCEDURE sign_up(
	IN in_user_first_name VARCHAR,
	IN in_user_last_name VARCHAR,
	IN in_user_username VARCHAR,
	IN in_user_email VARCHAR,
	IN in_user_password_hash VARCHAR,
	IN in_user_document_country VARCHAR,
	IN in_user_document_type VARCHAR,
	IN in_user_document_number VARCHAR,
	OUT out_user_id BIGINT,
	OUT out_is_country_valid BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    out_country_id BIGINT;
    out_person_id BIGINT;
    out_document_id BIGINT;
    out_profile_id BIGINT;
BEGIN
    -- Get the country ID
    SELECT 
        id 
    INTO out_country_id
    FROM countries
    WHERE name = in_user_document_country;
    
    -- Check if the country ID is valid
    IF out_country_id IS NULL THEN
        out_is_country_valid := FALSE;
        RETURN;
    ELSE
        out_is_country_valid := TRUE;
    END IF;

    -- Insert into people table according to the document type
    IF in_user_document_type = 'identity_document' THEN
        -- Insert into identity_documents table
        INSERT INTO identity_documents (
            country_id,
            identity_document_number
        )
        VALUES (
            out_country_id,
            in_user_document_number
        )
        RETURNING
            id INTO out_document_id;
        
        -- Insert into people table
        INSERT INTO people (
            first_name,
            last_name,
            identity_document_id
        )
        VALUES (
            in_user_first_name,
            in_user_last_name,
            out_document_id
        )
        RETURNING
            id INTO out_person_id;
    ELSE
        -- Insert into passports table
        INSERT INTO passports (
            country_id,
            passport_number
        )
        VALUES (
            out_country_id,
            in_user_document_number
        )
        RETURNING
            id INTO out_document_id;
        
        -- Insert into people table
        INSERT INTO people (
            first_name,
            last_name,
            passport_id
        )
        VALUES (
            in_user_first_name,
            in_user_last_name,
            out_document_id
        )
        RETURNING
            id INTO out_person_id;
    END IF;    
        
	-- Insert into users table
	INSERT INTO users (
		person_id
    )
    VALUES (
        out_person_id
    )
    RETURNING
        id INTO out_user_id;

	-- Insert into user_usernames table
	INSERT INTO user_usernames (
		user_id, 
		username
	)
	VALUES (
		out_user_id, 
		in_user_username
	);

	-- Insert into user_emails table
	INSERT INTO user_emails (
		user_id, 
		email
	)
	VALUES (
		out_user_id, 
		in_user_email
	);

	-- Insert into user_password_hashes table
	INSERT INTO user_password_hashes (
		user_id, 
		password_hash
	) 
	VALUES (
		out_user_id, 
		in_user_password_hash
	);
	
	-- Get the profile ID for the student profile
	SELECT id INTO out_profile_id
	FROM profiles
    WHERE name = 'student';
	
	-- Insert into user_profiles table
	INSERT INTO user_profiles (
        user_id, 
        profile_id
    )
    VALUES (
        out_user_id, 
        out_profile_id
    );
END;
$$;
`

// Create a stored procedure that logs in a user
export const CREATE_LOG_IN_PROC = `
CREATE OR REPLACE PROCEDURE log_in(
    IN in_user_username VARCHAR,
    OUT out_user_id BIGINT,
    OUT out_user_password_hash VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Select the user id
    SELECT user_usernames.user_id, user_password_hashes.password_hash
    INTO out_user_id, out_user_password_hash
    FROM user_usernames
    INNER JOIN user_password_hashes
    ON user_usernames.user_id = user_password_hashes.user_id
    WHERE username = in_user_username;
END;
$$;
`

// Create a stored procedure that adds a new user profile
export const CREATE_ADD_USER_PROFILE_PROC = `
CREATE OR REPLACE PROCEDURE add_user_profile(
    IN in_user_username VARCHAR,
    IN in_profile_name VARCHAR,
    OUT out_user_id BIGINT,
    OUT out_profile_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Get the user ID
    SELECT user_id INTO out_user_id
    FROM user_usernames
    WHERE username = in_user_username;

    -- Get the profile ID
    SELECT id INTO out_profile_id
    FROM profiles
    WHERE name = in_profile_name;

    -- Insert into user_profiles table
    INSERT INTO user_profiles (
        user_id,
        profile_id
    )
    VALUES (
        out_user_id,
        out_profile_id
    );
END;
$$;
`
