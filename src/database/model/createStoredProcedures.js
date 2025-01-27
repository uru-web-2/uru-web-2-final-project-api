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
EXCEPTION 
	WHEN OTHERS THEN 
		RAISE;
END;
$$;
`