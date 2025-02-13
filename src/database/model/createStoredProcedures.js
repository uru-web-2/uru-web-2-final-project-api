// CreateSignUpProc is a stored procedure that creates a new user in the database
export const CREATE_SIGN_UP_PROC = `
CREATE OR REPLACE PROCEDURE sign_up(
	IN in_first_name VARCHAR,
	IN in_last_name VARCHAR,
	IN in_username VARCHAR,
	IN in_email VARCHAR,
	IN in_password_hash VARCHAR,
	OUT out_user_id BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
     var_profile_id BIGINT;
BEGIN
	-- Insert into users table
	INSERT INTO users (
		first_name,
		last_name
	) 
	VALUES (
		in_first_name, 
		in_last_name
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
		in_username
	);

	-- Insert into user_emails table
	INSERT INTO user_emails (
		user_id, 
		email
	)
	VALUES (
		out_user_id, 
		in_email
	);

	-- Insert into user_password_hashes table
	INSERT INTO user_password_hashes (
		user_id, 
		password_hash
	) 
	VALUES (
		out_user_id, 
		in_password_hash
	);
	
	-- Get the profile ID for the student profile
	SELECT id INTO var_profile_id
	FROM profiles
    WHERE name = 'student';
	
	-- Insert into user_profiles table
	INSERT INTO user_profiles (
        user_id, 
        profile_id
    )
    VALUES (
        out_user_id, 
        var_profile_id
    );
EXCEPTION 
	WHEN OTHERS THEN 
		RAISE;
END;
$$;
`

// Create a stored procedure that logs in a user
export const CREATE_LOG_IN_PROC = `
CREATE OR REPLACE PROCEDURE log_in(
    IN in_username VARCHAR,
    OUT out_user_id BIGINT,
    OUT out_password_hash VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Select the user id
    SELECT user_usernames.user_id, user_password_hashes.password_hash
    INTO out_user_id, out_password_hash
    FROM user_usernames
    INNER JOIN user_password_hashes
    ON user_usernames.user_id = user_password_hashes.user_id
    WHERE username = in_username;
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
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
