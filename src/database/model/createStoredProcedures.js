import {PROFILES_NAME} from "../../components/constants.js";

// Create a stored procedure that gets a country ID by name
export const CREATE_GET_COUNTRY_ID_BY_NAME_PROC = `
CREATE OR REPLACE PROCEDURE get_country_id_by_name(
    IN in_country_name VARCHAR,
    OUT out_country_id BIGINT,
    OUT out_country_name_is_valid BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Select the country ID
    SELECT 
        id 
    INTO out_country_id
    FROM countries
    WHERE name = in_country_name;
    
    -- Check if the country ID is valid
    IF out_country_id IS NULL THEN
        out_country_name_is_valid := FALSE;
    ELSE
        out_country_name_is_valid := TRUE;
    END IF;
END;
$$;
`

// Create a stored procedure that creates a new user personal document
export const CREATE_CREATE_USER_PERSONAL_DOCUMENT_PROC = `
CREATE OR REPLACE PROCEDURE create_user_personal_document(
    IN in_created_by_user_id BIGINT,
    IN in_user_document_country_id BIGINT,
    IN in_user_document_type VARCHAR,
    IN in_user_document_number VARCHAR,
    OUT out_document_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into people table according to the document type
    IF in_user_document_type = 'Identity Document' THEN
        -- Insert into identity_documents table
        INSERT INTO identity_documents (
            country_id,
            identity_document_number,
            created_by_user_id
        )
        VALUES (
            in_user_document_country_id,
            in_user_document_number,
            in_created_by_user_id
        )
        RETURNING
            id INTO out_document_id;
    ELSE
        -- Insert into passports table
        INSERT INTO passports (
            country_id,
            passport_number,
            created_by_user_id
        )
        VALUES (
            in_user_document_country_id,
            in_user_document_number,
            in_created_by_user_id
        )
        RETURNING
            id INTO out_document_id;
    END IF;
END;    
$$;
`

// Create a stored procedure that removes a user personal document
export const CREATE_REMOVE_USER_PERSONAL_DOCUMENT_PROC = `
CREATE OR REPLACE PROCEDURE remove_user_personal_document(
    IN in_removed_by_user_id BIGINT,
    IN in_user_document_type VARCHAR,
    IN in_user_document_number VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Delete the user personal document
    IF in_user_document_type = 'Identity Document' THEN
        UPDATE identity_documents
        SET removed_at = NOW(),
            removed_by_user_id = in_removed_by_user_id
        WHERE identity_document_number = in_user_document_number
        AND removed_at IS NULL;
    ELSE
        UPDATE passports
        SET removed_at = NOW(),
            removed_by_user_id = in_removed_by_user_id
        WHERE passport_number = in_user_document_number
        AND removed_at IS NULL;
    END IF;
END;
$$;
`

// Create a stored procedure that replaces a user personal document
export const CREATE_REPLACE_USER_PERSONAL_DOCUMENT_PROC = `
CREATE OR REPLACE PROCEDURE replace_user_personal_document(
    IN in_replaced_by_user_id BIGINT,
    IN in_user_document_country_id BIGINT,
    IN in_user_document_type VARCHAR,
    IN in_user_document_number VARCHAR,
    OUT out_document_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Delete the user personal document
    call remove_user_personal_document(in_replaced_by_user_id, in_user_document_type, in_user_document_number);
    
    -- Create the user personal document
    call create_user_personal_document(in_replaced_by_user_id, in_user_document_country_id, in_user_document_type, in_user_document_number, out_document_id);
END;
$$;
`

// Create a stored procedure that creates a new person
export const CREATE_CREATE_PERSON_PROC = `
CREATE OR REPLACE PROCEDURE create_person(
    IN in_created_by_user_id BIGINT,
    IN in_user_first_name VARCHAR,
    IN in_user_last_name VARCHAR,
    IN in_user_document_country_id BIGINT,
    IN in_user_document_type VARCHAR,
    IN in_user_document_number VARCHAR,
    OUT out_person_id BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE 
    var_document_id BIGINT;
BEGIN
    -- Create the user personal document
    call create_user_personal_document(in_created_by_user_id, in_user_document_country_id, in_user_document_type, in_user_document_number, var_document_id);

    -- Insert into people table according to the document type
    IF in_user_document_type = 'Identity Document' THEN        
        -- Insert into people table
        INSERT INTO people (
            first_name,
            last_name,
            identity_document_id
        )
        VALUES (
            in_user_first_name,
            in_user_last_name,
            var_document_id
        )
        RETURNING
            id INTO out_person_id;
    ELSE        
        -- Insert into people table
        INSERT INTO people (
            first_name,
            last_name,
            passport_id
        )
        VALUES (
            in_user_first_name,
            in_user_last_name,
            var_document_id
        )
        RETURNING
            id INTO out_person_id;
    END IF;
END;    
$$;
`

// Create a stored procedure that creates a new user email
export const CREATE_CREATE_USER_EMAIL_PROC = `
CREATE OR REPLACE PROCEDURE create_user_email(
    IN in_user_id BIGINT,
    IN in_user_email VARCHAR,
    IN in_user_email_verification_token VARCHAR,
    IN in_user_email_verification_expires_at TIMESTAMP,
    OUT out_user_email_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into user_emails table
    INSERT INTO user_emails (
        user_id,
        email
    )
    VALUES (
        in_user_id,
        in_user_email
    )
    RETURNING
        id INTO out_user_email_id;
        
    -- Insert the user email verification
    INSERT INTO user_email_verification_tokens (
        user_email_id,
        verification_token,
        expires_at
    )
    VALUES (
        out_user_email_id,
        in_user_email_verification_token,
        in_user_email_verification_expires_at
    );
END;
$$;
`

// Create a stored procedure that updates a user email
export const CREATE_UPDATE_USER_EMAIL_PROC = `
CREATE OR REPLACE PROCEDURE update_user_email(
    IN in_user_id BIGINT,
    IN in_user_email VARCHAR,
    IN in_user_email_verification_token VARCHAR,
    IN in_user_email_verification_expires_at TIMESTAMP,
    OUT out_user_email_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the user email
    UPDATE user_emails
    SET removed_at = NOW()
    WHERE user_id = in_user_id
    AND removed_at IS NULL;
    
    -- Create the user email
    call create_user_email(in_user_id, in_user_email, in_user_email_verification_token, in_user_email_verification_expires_at, out_user_email_id);
END;
$$;
`


// Create a stored procedure that removes a user email verification token by user email ID
export const CREATE_REMOVE_USER_EMAIL_VERIFICATION_TOKEN_BY_USER_EMAIL_ID_PROC = `
CREATE OR REPLACE PROCEDURE remove_user_email_verification_token_by_user_email_id(
    IN in_user_email_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the user_email_verification_tokens table
    UPDATE user_email_verification_tokens
    SET removed_at = NOW()
    WHERE user_email_id = in_user_email_id
    AND removed_at IS NULL
    AND expires_at > NOW()
    AND verified_at IS NULL;
END;
$$;
`

// Create a stored procedure that creates a new user email verification token
export const CREATE_CREATE_USER_EMAIL_VERIFICATION_TOKEN_PROC = `
CREATE OR REPLACE PROCEDURE create_user_email_verification_token(
    IN in_user_email_id BIGINT,
    IN in_user_email_verification_token VARCHAR,
    IN in_user_email_verification_expires_at TIMESTAMP,
    OUT out_user_email_is_verified BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if the user email is verified
    SELECT verified_at IS NOT NULL
    INTO out_user_email_is_verified
    FROM user_email_verification_tokens
    WHERE user_email_id = in_user_email_id
    AND verified_at IS NOT NULL
    AND removed_at IS NULL;
    
    IF out_user_email_is_verified = TRUE THEN
        RETURN;
    END IF;

    -- Remove the user email verification
    call remove_user_email_verification_token_by_user_email_id(in_user_email_id);

    -- Insert into user_email_verification_tokens table
    INSERT INTO user_email_verification_tokens (
        user_email_id,
        verification_token,
        expires_at
    )
    VALUES (
        in_user_email_id,
        in_user_email_verification_token,
        in_user_email_verification_expires_at
    );
END;
$$;
`

// Create a stored procedure that gets the user email information by user ID
export const CREATE_GET_USER_EMAIL_INFO_BY_USER_ID_PROC = `
CREATE OR REPLACE PROCEDURE get_user_email_info_by_user_id(
    IN in_user_id BIGINT,
    OUT out_user_first_name VARCHAR,
    OUT out_user_last_name VARCHAR,
    OUT out_user_email_id BIGINT,
    OUT out_user_email VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Select the user email information
    SELECT user_emails.id, user_emails.email, people.first_name, people.last_name
    INTO out_user_email_id, out_user_email, out_user_first_name, out_user_last_name
    FROM user_emails
    INNER JOIN users ON user_emails.user_id = users.id
    INNER JOIN people ON users.person_id = people.id
    WHERE user_emails.user_id = in_user_id;
END;
$$;
`

// Create a stored procedure that gets a user email information by user email
export const CREATE_GET_USER_EMAIL_INFO_BY_USER_EMAIL_PROC = `
CREATE OR REPLACE PROCEDURE get_user_email_info_by_user_email(
    IN in_user_email VARCHAR,
    OUT out_user_id BIGINT,
    OUT out_user_first_name VARCHAR,
    OUT out_user_last_name VARCHAR,
    OUT out_user_email_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Select the user email information
    SELECT users.id, user_emails.id, people.first_name, people.last_name
    INTO out_user_id, out_user_email_id, out_user_first_name, out_user_last_name
    FROM user_emails
    INNER JOIN users ON user_emails.user_id = users.id
    INNER JOIN people ON users.person_id = people.id
    WHERE user_emails.email = in_user_email;
END;
$$;
`

// Create a stored procedure that verifies a user email verification token
export const CREATE_VERIFY_USER_EMAIL_VERIFICATION_TOKEN_PROC = `
CREATE OR REPLACE PROCEDURE verify_user_email_verification_token(
    IN in_user_email_verification_token VARCHAR,
    OUT out_user_email_verification_token_is_valid BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if the user email verification token is valid
    SELECT TRUE
    INTO out_user_email_verification_token_is_valid
    FROM user_email_verification_tokens
    WHERE verification_token = in_user_email_verification_token
    AND expires_at > NOW()
    AND verified_at IS NULL;

    -- Update the user_email_verification_tokens table
    UPDATE user_email_verification_tokens
    SET verified_at = NOW()
    WHERE verification_token = in_user_email_verification_token
    AND expires_at > NOW()
    AND verified_at IS NULL;
END;
$$;
`

// Create a stored procedure that removes a user reset password token by user ID
export const CREATE_REMOVE_USER_RESET_PASSWORD_TOKEN_BY_USER_ID_PROC = `
CREATE OR REPLACE PROCEDURE remove_user_reset_password_token_by_user_id(
    IN in_user_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the user_reset_password_tokens table
    UPDATE user_reset_password_tokens
    SET removed_at = NOW()
    WHERE user_id = in_user_id
    AND removed_at IS NULL
    AND expires_at > NOW()
    AND used_at IS NULL;
END;
$$;
`

// Create a stored procedure that creates a new user reset password token
export const CREATE_CREATE_USER_RESET_PASSWORD_TOKEN_PROC = `
CREATE OR REPLACE PROCEDURE create_user_reset_password_token(
    IN in_user_id BIGINT,
    IN in_user_reset_password_token VARCHAR,
    IN in_user_reset_password_expires_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Remove the user reset password token
    call remove_user_reset_password_token_by_user_id(in_user_id);
    
    -- Insert into user_reset_password_tokens table
    INSERT INTO user_reset_password_tokens (
        user_id,
        reset_password_token,
        expires_at
    )
    VALUES (
        in_user_id,
        in_user_reset_password_token,
        in_user_reset_password_expires_at
    );
END;
$$;
`

// Create a stored procedure that updates a user password hash
export const CREATE_UPDATE_USER_PASSWORD_HASH_PROC = `
CREATE OR REPLACE PROCEDURE update_user_password_hash(
    IN in_user_id BIGINT,
    IN in_user_password_hash VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Remove the user password hash
    UPDATE user_password_hashes
    SET removed_at = NOW()
    WHERE user_id = in_user_id
    AND removed_at IS NULL;
    
    -- Insert into user_password_hashes table
    INSERT INTO user_password_hashes (
        user_id,
        password_hash
    )
    VALUES (
        in_user_id,
        in_user_password_hash
    );
END;
$$;
`

// Create a stored procedure that resets a user password
export const CREATE_RESET_USER_PASSWORD_PROC = `
CREATE OR REPLACE PROCEDURE reset_user_password(
    IN in_user_reset_password_token VARCHAR,
    IN in_user_password_hash VARCHAR,
    OUT out_user_reset_password_token_is_valid BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_user_reset_password_token_id BIGINT;
    var_user_id BIGINT;
BEGIN
    -- Check if the user reset password token is valid
    SELECT id, user_id
    INTO var_user_reset_password_token_id, var_user_id
    FROM user_reset_password_tokens
    WHERE reset_password_token = in_user_reset_password_token
    AND expires_at > NOW()
    AND used_at IS NULL;

    IF var_user_reset_password_token_id IS NULL THEN
        out_user_reset_password_token_is_valid := FALSE;
        RETURN;
    ELSE
        out_user_reset_password_token_is_valid := TRUE;
    END IF;

    -- Remove the user reset password token
    UPDATE user_reset_password_tokens
    SET used_at = NOW()
    WHERE id = var_user_reset_password_token_id;    
    
    -- Update the user password hash
    call update_user_password_hash(var_user_id, in_user_password_hash);
END;
$$;
`

// Create a stored procedure that creates a new user
export const CREATE_CREATE_USER_PROC = `
CREATE OR REPLACE PROCEDURE create_user(
    IN in_created_by_user_id BIGINT,
	IN in_user_first_name VARCHAR,
	IN in_user_last_name VARCHAR,
	IN in_user_username VARCHAR,
	IN in_user_email VARCHAR,
	IN in_user_password_hash VARCHAR,
	IN in_user_document_country VARCHAR,
	IN in_user_document_type VARCHAR,
	IN in_user_document_number VARCHAR,
	IN in_user_email_verification_token VARCHAR,
	IN in_user_email_verification_expires_at TIMESTAMP,
	OUT out_user_id BIGINT,
    OUT out_country_name_is_valid BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_person_id BIGINT;
    var_document_id BIGINT;
    var_profile_id BIGINT;
    var_user_email_id BIGINT;
    var_user_document_country_id BIGINT;
BEGIN
    -- Get the country ID
    call get_country_id_by_name(in_user_document_country, var_user_document_country_id, out_country_name_is_valid);
    
    -- Check if the country name is valid
    IF out_country_name_is_valid = FALSE THEN
        RETURN;
    END IF;

    -- Create the person
    call create_person(in_created_by_user_id, in_user_first_name, in_user_last_name, var_user_document_country_id, in_user_document_type, in_user_document_number, var_person_id);
        
	-- Insert into users table
	INSERT INTO users (
		person_id
    )
    VALUES (
        var_person_id
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
	call create_user_email(out_user_id, in_user_email, in_user_email_verification_token, in_user_email_verification_expires_at, var_user_email_id);

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
	SELECT id INTO var_profile_id
	FROM profiles
    WHERE name = '${PROFILES_NAME.STUDENT}';
	
	-- Insert into user_profiles table
	INSERT INTO user_profiles (
        user_id, 
        profile_id
    )
    VALUES (
        out_user_id, 
        var_profile_id
    );
END;
$$;
`

// Create a stored procedure that logs in a user
export const CREATE_LOG_IN_PROC = `
CREATE OR REPLACE PROCEDURE log_in(
    IN in_user_username VARCHAR,
    OUT out_user_id BIGINT,
    OUT out_user_password_hash VARCHAR,
    OUT out_user_email_is_verified BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Select the user id
    SELECT user_usernames.user_id, user_password_hashes.password_hash, user_email_verification_tokens.verified_at IS NOT NULL
    INTO out_user_id, out_user_password_hash, out_user_email_is_verified
    FROM user_usernames
    INNER JOIN user_password_hashes ON user_password_hashes.user_id = user_usernames.user_id
    INNER JOIN user_emails ON user_emails.user_id = user_usernames.user_id
    INNER JOIN user_email_verification_tokens ON user_email_verification_tokens.user_email_id = user_emails.id
    WHERE username = in_user_username
    AND user_usernames.removed_at IS NULL
    AND user_password_hashes.removed_at IS NULL
    AND user_emails.removed_at IS NULL
    AND user_email_verification_tokens.removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that gets the user ID by username
export const CREATE_GET_USER_ID_BY_USERNAME_PROC = `
CREATE OR REPLACE PROCEDURE get_user_id_by_username(
    IN in_user_username VARCHAR,
    OUT out_user_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Select the user id
    SELECT user_id
    INTO out_user_id
    FROM user_usernames
    WHERE username = in_user_username
    AND removed_at IS NULL;
END;
$$;
`

// Create a stored procedure to check if a profile ID is valid
export const CREATE_IS_PROFILE_ID_VALID_PROC = `
CREATE OR REPLACE PROCEDURE is_profile_id_valid(
    IN in_profile_id BIGINT,
    OUT out_is_profile_id_valid BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Set the default value
    out_is_profile_id_valid := FALSE;

    -- Check if the profile ID is valid
    SELECT TRUE
    INTO out_is_profile_id_valid
    FROM profiles
    WHERE id = in_profile_id
    AND removed_at IS NULL;
END;
$$;
`

// Create a stored procedure to check if a method ID is valid
export const CREATE_IS_METHOD_ID_VALID_PROC = `
CREATE OR REPLACE PROCEDURE is_method_id_valid(
    IN in_method_id BIGINT,
    OUT out_is_method_id_valid BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Set the default value
    out_is_method_id_valid := FALSE;

    -- Check if the method ID is valid    
    SELECT TRUE
    INTO out_is_method_id_valid
    FROM methods
    WHERE id = in_method_id
    AND removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that creates a profile to a user
export const CREATE_CREATE_USER_PROFILE_PROC = `
CREATE OR REPLACE PROCEDURE create_user_profile(
    IN in_created_by_user_id BIGINT,
    IN in_user_username VARCHAR,
    IN in_profile_id BIGINT,
    OUT out_is_profile_id_valid BOOLEAN,
    OUT out_user_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Get the user ID
    call get_user_id_by_username(in_user_username, out_user_id);
    
    -- Check if the user ID is valid
    IF out_user_id IS NULL THEN
        RETURN;
    END IF;
    
    -- Check if the profile ID is valid
    call is_profile_id_valid(in_profile_id, out_is_profile_id_valid);
    IF out_is_profile_id_valid = FALSE THEN
        RETURN;
    END IF;
    
    -- Insert into user_profiles table
    INSERT INTO user_profiles (
        user_id,
        profile_id,
        created_by_user_id
    )
    VALUES (
        out_user_id,
        in_profile_id,
        in_created_by_user_id
    );
END;
$$;
`

// Create a stored procedure that removes a profile from a user
export const CREATE_REMOVE_USER_PROFILE_PROC = `
CREATE OR REPLACE PROCEDURE remove_user_profile(
    IN in_removed_by_user_id BIGINT,
    IN in_user_username VARCHAR,
    IN in_profile_id BIGINT,
    OUT out_is_profile_id_valid BOOLEAN,
    OUT out_user_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Get the user ID
    call get_user_id_by_username(in_user_username, out_user_id);
    
    -- Check if the user ID is valid
    IF out_user_id IS NULL THEN
        RETURN;
    END IF;
    
    -- Check if the profile ID is valid
    call is_profile_id_valid(in_profile_id, out_is_profile_id_valid);
    
    -- Update the user_profiles table
    UPDATE user_profiles
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE user_id = out_user_id
    AND profile_id = in_profile_id
    AND removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that gets a permission ID by profile ID and method ID
export const CREATE_GET_PERMISSION_ID_BY_PROFILE_ID_METHOD_ID_PROC = `
CREATE OR REPLACE PROCEDURE get_permission_id_by_profile_id_method_id(
    IN in_profile_id BIGINT,
    IN in_method_id BIGINT,
    OUT out_permission_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if the permission already exists
    SELECT id
    INTO out_permission_id
    FROM permissions
    WHERE profile_id = in_profile_id
    AND method_id = in_method_id
    AND removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that creates a permission to a profile
export const CREATE_CREATE_PROFILE_PERMISSION_PROC = `
CREATE OR REPLACE PROCEDURE create_profile_permission(
    IN in_created_by_user_id BIGINT,
    IN in_profile_id BIGINT,
    IN in_method_id BIGINT,
    OUT out_is_profile_id_valid BOOLEAN,
    OUT out_is_method_id_valid BOOLEAN,
    OUT out_permission_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if the profile ID is valid
    call is_profile_id_valid(in_profile_id, out_is_profile_id_valid);
    IF out_is_profile_id_valid = FALSE THEN
        RETURN;
    END IF;
    
    -- Check if the method ID is valid
    call is_method_id_valid(in_method_id, out_is_method_id_valid);
    IF out_is_method_id_valid = FALSE THEN
        RETURN;
    END IF;

    -- Check if the permission already exists
    call get_permission_id_by_profile_id_method_id(in_profile_id, in_method_id, out_permission_id);

    IF out_permission_id IS NOT NULL THEN
        RETURN;
    END IF;

    -- Insert into permissions table
    INSERT INTO permissions (
        profile_id,
        method_id,
        created_by_user_id
    )
    VALUES (
        in_profile_id,
        in_method_id,
        in_created_by_user_id
    )
    RETURNING id INTO out_permission_id;
END;
$$;
`

// Create a stored procedure that removes a permission from a profile
export const CREATE_REMOVE_PROFILE_PERMISSION_PROC = `
CREATE OR REPLACE PROCEDURE remove_profile_permission(
    IN in_removed_by_user_id BIGINT,
    IN in_profile_id BIGINT,
    IN in_method_id BIGINT,
    OUT out_is_profile_id_valid BOOLEAN,
    OUT out_is_method_id_valid BOOLEAN,
    OUT out_permission_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if the profile ID is valid
    call is_profile_id_valid(in_profile_id, out_is_profile_id_valid);
    IF out_is_profile_id_valid = FALSE THEN
        RETURN;
    END IF;
    
    -- Check if the method ID is valid
    call is_method_id_valid(in_method_id, out_is_method_id_valid);
    IF out_is_method_id_valid = FALSE THEN
        RETURN;
    END IF;
    
    -- Check if the permission does not exist
    call get_permission_id_by_profile_id_method_id(in_profile_id, in_method_id, out_permission_id);

    IF out_permission_id IS NULL THEN
        RETURN;
    END IF;
    
    -- Update the permissions table
    UPDATE permissions
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE profile_id = in_profile_id
    AND method_id = in_method_id
    AND removed_at IS NULL
    RETURNING id INTO out_permission_id;
END;
$$;
`

// Create a stored procedure that creates a new profile
export const CREATE_CREATE_PROFILE_PROC = `
CREATE OR REPLACE PROCEDURE create_profile(
    IN in_created_by_user_id BIGINT,
    IN in_profile_name VARCHAR,
    IN in_profile_description TEXT,
    OUT out_profile_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into profiles table
    INSERT INTO profiles (
        created_by_user_id,
        name,
        description
    )
    VALUES (
        in_created_by_user_id,
        in_profile_name,
        in_profile_description
    )
    RETURNING id INTO out_profile_id;
END;
$$;
`

// Create a stored procedure that updates a profile
export const CREATE_UPDATE_PROFILE_PROC = `
CREATE OR REPLACE PROCEDURE update_profile(
    IN in_updated_by_user_id BIGINT,
    IN in_profile_id BIGINT,
    IN in_profile_name VARCHAR,
    IN in_profile_description TEXT,
    OUT out_is_profile_id_valid BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_current_profile_name VARCHAR;
    var_current_profile_description TEXT;
BEGIN
    -- Check if the profile ID is valid
    call is_profile_id_valid(in_profile_id, out_is_profile_id_valid);
    IF out_is_profile_id_valid = FALSE THEN
        RETURN;
    END IF;
    
    -- Select the current profile name and description
    SELECT name, description
    INTO var_current_profile_name, var_current_profile_description
    FROM profiles
    WHERE id = in_profile_id
    AND removed_at IS NULL;

    -- Update the profiles table
    UPDATE profiles
    SET name = COALESCE(in_profile_name, var_current_profile_name),
        description = COALESCE(in_profile_description, var_current_profile_description),
        updated_at = NOW(),
        updated_by_user_id = in_updated_by_user_id
    WHERE id = in_profile_id;
END;
$$;
`

// Create a stored procedure that removes a profile
export const CREATE_REMOVE_PROFILE_PROC = `
CREATE OR REPLACE PROCEDURE remove_profile(
    IN in_removed_by_user_id BIGINT,
    IN in_profile_id BIGINT,
    OUT out_is_profile_id_valid BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if the profile ID is valid
    call is_profile_id_valid(in_profile_id, out_is_profile_id_valid);
    IF out_is_profile_id_valid = FALSE THEN
        RETURN;
    END IF;

    -- Update the profiles table
    UPDATE profiles
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE id = in_profile_id
    AND removed_at IS NULL;
    
    -- Update the permissions table
    UPDATE permissions
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE profile_id = in_profile_id
    AND removed_at IS NULL;
    
    -- Update the user_profiles table
    UPDATE user_profiles
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE profile_id = in_profile_id
    AND removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that creates a new module
export const CREATE_CREATE_MODULE_PROC = `
CREATE OR REPLACE PROCEDURE create_module(
    IN in_created_by_user_id BIGINT,
    IN in_module_name VARCHAR,
    IN in_parent_module_id BIGINT,
    OUT out_module_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into modules table
    INSERT INTO modules (
        created_by_user_id,
        name,
        parent_module_id
    )
    VALUES (
        in_created_by_user_id,
        in_module_name,
        in_parent_module_id
    )
    RETURNING id INTO out_module_id;
END;
$$;
`

// Create a stored procedure that creates a new object
export const CREATE_CREATE_OBJECT_PROC = `
CREATE OR REPLACE PROCEDURE create_object(
    IN in_created_by_user_id BIGINT,
    IN in_object_name VARCHAR,
    IN in_module_id BIGINT,
    OUT out_object_id BIGINT
)   
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into objects table
    INSERT INTO objects (
        created_by_user_id,
        name,
        module_id
    )
    VALUES (
        in_created_by_user_id,
        in_object_name,
        in_module_id
    )
    RETURNING id INTO out_object_id;
END;
$$;
`

// Create a stored procedure that creates a new method
export const CREATE_CREATE_METHOD_PROC = `
CREATE OR REPLACE PROCEDURE create_method(
    IN in_created_by_user_id BIGINT,
    IN in_method_name VARCHAR,
    IN in_object_id BIGINT,
    OUT out_method_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into methods table
    INSERT INTO methods (
        created_by_user_id,
        name,
        object_id
    )
    VALUES (
        in_created_by_user_id,
        in_method_name,
        in_object_id
    )
    RETURNING id INTO out_method_id;
END;
$$;
`

// Create a stored procedure that creates a new method with the profiles for the permissions
export const CREATE_CREATE_METHOD_WITH_PROFILES_PROC = `
CREATE OR REPLACE PROCEDURE create_method_with_profiles(
    IN in_created_by_user_id BIGINT,
    IN in_method_name VARCHAR,
    IN in_object_id BIGINT,
    IN in_profile_ids BIGINT[],
    OUT out_method_id BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_profile_id BIGINT;
BEGIN
    -- Insert into methods table
    INSERT INTO methods (
        created_by_user_id,
        name,
        object_id
    )
    VALUES (
        in_created_by_user_id,
        in_method_name,
        in_object_id
    )
    RETURNING id INTO out_method_id;
    
    -- Insert into permissions table
    FOREACH var_profile_id IN ARRAY in_profile_ids
    LOOP
        INSERT INTO permissions (
            profile_id,
            method_id,
            created_by_user_id
        )
        VALUES (
            var_profile_id,
            out_method_id,
            in_created_by_user_id
        );
    END LOOP;
END;
$$;
`

// Create a stored procedure that removes all modules
export const CREATE_REMOVE_ALL_MODULES_PROC = `
CREATE OR REPLACE PROCEDURE remove_all_modules(
    IN in_removed_by_user_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the modules table
    UPDATE modules
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE removed_at IS NULL;
    
    -- Update the objects table
    UPDATE objects
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE removed_at IS NULL;
    
    -- Update the methods table
    UPDATE methods
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE removed_at IS NULL;
    
    -- Update the permissions table
    UPDATE permissions
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that gets the module ID by name
export const CREATE_GET_MODULE_ID_BY_NAME_PROC = `
CREATE OR REPLACE PROCEDURE get_module_id_by_name(
    IN in_module_name VARCHAR,
    OUT out_module_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Select the module id
    SELECT id
    INTO out_module_id
    FROM modules
    WHERE name = in_module_name
    AND removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that gets the object ID by name
export const CREATE_GET_OBJECT_ID_BY_NAME_PROC = `
CREATE OR REPLACE PROCEDURE get_object_id_by_name(
    IN in_object_name VARCHAR,
    OUT out_object_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Select the object id
    SELECT id
    INTO out_object_id
    FROM objects
    WHERE name = in_object_name
    AND removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that gets the method ID by name
export const CREATE_GET_METHOD_ID_BY_NAME_PROC = `
CREATE OR REPLACE PROCEDURE get_method_id_by_name(
    IN in_method_name VARCHAR,
    OUT out_method_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Select the method id
    SELECT id
    INTO out_method_id
    FROM methods
    WHERE name = in_method_name
    AND removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that gets the number of users
export const CREATE_GET_NUMBER_OF_USERS_PROC = `
CREATE OR REPLACE PROCEDURE get_number_of_users(
    OUT out_number_of_users BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Select the number of users
    SELECT COUNT(*)
    INTO out_number_of_users
    FROM users;
END;
$$;
`

// Create a stored procedure that updates a user username
export const CREATE_UPDATE_USER_USERNAME_PROC = `
CREATE OR REPLACE PROCEDURE update_user_username(
    IN in_user_id BIGINT,
    IN in_user_username VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Remove the current username
    UPDATE user_usernames
    SET removed_at = NOW()
    WHERE user_id = in_user_id
    AND removed_at IS NULL;
    
    -- Insert into user_usernames table
    INSERT INTO user_usernames (
        user_id,
        username
    )
    VALUES (
        in_user_id,
        in_user_username
    );
END;
$$;
`

// Create a stored procedure that updates the user fields to be used by administrators
export const CREATE_UPDATE_USER_BY_ADMIN_PROC = `
CREATE OR REPLACE PROCEDURE update_user_by_admin(
    IN in_updated_by_user_id BIGINT,
    IN in_user_id BIGINT,
    IN in_user_first_name VARCHAR,
    IN in_user_last_name VARCHAR,
    IN in_user_username VARCHAR,
    IN in_user_document_country VARCHAR,
    IN in_user_document_type VARCHAR,
    IN in_user_document_number VARCHAR,
    OUT out_country_name_is_valid BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_current_user_first_name VARCHAR;
    var_current_user_last_name VARCHAR;
    var_user_document_country_id BIGINT;
    var_document_id BIGINT;
BEGIN
    -- Get the country ID
    call get_country_id_by_name(in_user_document_country, var_user_document_country_id, out_country_name_is_valid);

    -- Replace the user personal document
    IF out_country_name_is_valid = TRUE AND in_user_document_type IS NOT NULL AND in_user_document_number IS NOT NULL THEN
        call replace_user_personal_document(in_updated_by_user_id, var_user_document_country_id, in_user_document_type, in_user_document_number, var_document_id);
    END IF;
    
    -- Get the current user first name and last name
    SELECT people.first_name, people.last_name
    INTO var_current_user_first_name, var_current_user_last_name
    FROM users
    INNER JOIN people ON users.person_id = people.id
    WHERE users.id = in_user_id;
        
    -- Update the people table
    UPDATE people
    SET first_name = COALESCE(in_user_first_name, var_current_user_first_name),
        last_name = COALESCE(in_user_last_name, var_current_user_last_name)
    WHERE people.id = (SELECT person_id FROM users WHERE id = in_user_id);
    
    -- Check if the username is not null
    IF in_user_username IS NOT NULL THEN
        -- Update the user_usernames table
        call update_user_username(in_user_id, in_user_username);
    END IF;
END;
$$;
`

// Create a stored procedure that creates a new document
export const CREATE_CREATE_DOCUMENT_PROC = `
CREATE OR REPLACE PROCEDURE create_document(
    IN in_registered_by_user_id BIGINT,
    IN in_document_title VARCHAR,
    IN in_document_description TEXT,
    IN in_document_release_date DATE,
    IN in_document_pages BIGINT,
    IN in_document_author VARCHAR,
    IN in_document_topic_ids BIGINT[],
    IN in_document_location_section_ids BIGINT[],
    IN in_document_language_ids BIGINT[],
    IN in_document_document_image_uuids VARCHAR[],
    IN in_document_document_image_extensions VARCHAR[],
    OUT out_document_id BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_document_topic_id BIGINT;
    var_document_location_section_id BIGINT;
    var_document_author_id BIGINT;
    var_document_language_id BIGINT;
    var_document_document_image_uuid VARCHAR;
    var_document_document_image_extension VARCHAR;
    var_document_document_image_uuids_length INT;
BEGIN
    -- Insert into documents table
    INSERT INTO documents (
        registered_by_user_id,
        title,
        description,
        release_date,
        pages,
        file_relative_url,
        author
    )
    VALUES (
        in_registered_by_user_id,
        in_document_title,
        in_document_description,
        in_document_release_date,
        in_document_pages,
        in_document_author
    )
    RETURNING id INTO out_document_id;
    
    -- Insert into document_topics table
    FOREACH var_document_topic_id IN ARRAY in_document_topic_ids
    LOOP
        call create_document_topic(in_registered_by_user_id, out_document_id, var_document_topic_id);
    END LOOP;
    
    -- Insert into document_location_sections table
    FOREACH var_document_location_section_id IN ARRAY in_document_location_section_ids
    LOOP
        call create_document_location_section(in_registered_by_user_id, out_document_id, var_document_location_section_id);
    END LOOP;
    
    -- Insert into document_languages table
    FOREACH var_document_language_id IN ARRAY in_document_language_ids
    LOOP
        call create_document_language(in_registered_by_user_id, out_document_id, var_document_language_id);
    END LOOP;
    
    -- Get the length of the document document image UUIDs
    SELECT array_length(in_document_document_image_uuids, 1)
    INTO var_document_document_image_uuids_length;
    
    -- Compare the length of the document document image UUIDs and the document document image extensions
    IF var_document_document_image_uuids_length = array_length(in_document_document_image_extensions, 1) THEN
        FOR i IN 1..var_document_document_image_uuids_length LOOP
            var_document_document_image_uuid := in_document_document_image_uuids[i];
            var_document_document_image_extension := in_document_document_image_extensions[i];
            call create_document_image(in_registered_by_user_id, out_document_id, var_document_document_image_uuid, var_document_document_image_extension);
        END LOOP;
    END IF;
END;
$$;
`

// Create a stored procedure that updates a document
export const CREATE_UPDATE_DOCUMENT_PROC = `
CREATE OR REPLACE PROCEDURE update_document(
    IN in_updated_by_user_id BIGINT,
    IN in_document_id BIGINT,
    IN in_document_title VARCHAR,
    IN in_document_description TEXT,
    IN in_document_release_date DATE,
    IN in_document_pages BIGINT,
    IN in_document_author VARCHAR,
    IN in_document_topic_ids BIGINT[],
    IN in_document_location_section_ids BIGINT[],
    IN in_document_language_ids BIGINT[],
    IN in_document_document_image_uuids VARCHAR[],
    IN in_document_document_image_extensions VARCHAR[]
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_current_document_title VARCHAR;
    var_current_document_description TEXT;
    var_current_document_release_date DATE;
    var_current_document_pages BIGINT;
    var_current_document_author VARCHAR;
    var_current_document_topic_ids BIGINT[];
    var_current_document_location_section_ids BIGINT[];
    var_current_document_language_ids BIGINT[];
    var_current_document_document_image_uuids VARCHAR[];
    var_document_topic_id BIGINT;
    var_document_location_section_id BIGINT;
    var_document_author_id BIGINT;
    var_document_language_id BIGINT;
    var_document_document_image_uuid VARCHAR;
    var_document_document_image_extension VARCHAR;
    var_current_document_document_image_uuids_length INT;
BEGIN
    -- Get the current document title, description, release date and pages
    SELECT title, description, release_date, pages, author
    INTO var_current_document_title, var_current_document_description, var_current_document_release_date, var_current_document_pages, var_current_document_author
    FROM documents
    WHERE id = in_document_id
    AND removed_at IS NULL;

    -- Update the documents table
    UPDATE documents
    SET title = COALESCE(var_document_title, title),
        description = COALESCE(var_document_description, description),
        release_date = COALESCE(var_document_release_date, release_date),
        pages = COALESCE(var_document_pages, pages),
        author = COALESCE(var_document_author, author)
    WHERE id = in_document_id;
    
    -- Select the current document topic IDs
    SELECT ARRAY(
        SELECT topic_id
        FROM document_topics
        WHERE document_id = in_document_id
        AND removed_at IS NULL
    )
    INTO var_current_document_topic_ids;
    
    -- Insert into document_topics table
    FOREACH var_document_topic_id IN ARRAY in_document_topic_ids
    LOOP
        IF var_document_topic_id <> ALL(var_current_document_topic_ids) THEN
            call create_document_topic(in_document_id, var_document_topic_id);
        END IF;
    END LOOP;
    
    -- Remove the document topics
    FOREACH var_document_topic_id IN ARRAY var_current_document_topic_ids
    LOOP
        IF var_document_topic_id <> ALL(in_document_topic_ids) THEN
            call remove_document_topic(in_document_id, var_document_topic_id);
        END IF;
    END LOOP;
    
    -- Select the current document location section IDs
    SELECT ARRAY(
        SELECT location_section_id
        FROM document_location_sections
        WHERE document_id = in_document_id
        AND removed_at IS NULL
    )
    INTO var_current_document_location_section_ids;
    
    -- Insert into document_location_sections table
    FOREACH var_document_location_section_id IN ARRAY in_document_location_section_ids
    LOOP
        IF var_document_location_section_id <> ALL(var_current_document_location_section_ids) THEN
            call create_document_location_section(in_document_id, var_document_location_section_id);
        END IF;
    END LOOP;
    
    -- Remove the document location sections
    FOREACH var_document_location_section_id IN ARRAY var_current_document_location_section_ids
    LOOP
        IF var_document_location_section_id <> ALL(in_document_location_section_ids) THEN
            call remove_document_location_section(in_document_id, var_document_location_section_id);
        END IF;
    END LOOP;
    
    -- Select the current document language IDs
    SELECT ARRAY(
        SELECT language_id
        FROM document_languages
        WHERE document_id = in_document_id
        AND removed_at IS NULL
    )
    INTO var_current_document_language_ids;
    
    -- Insert into document_languages table
    FOREACH var_document_language_id IN ARRAY in_document_language_ids
    LOOP
        IF var_document_language_id <> ALL(var_current_document_language_ids) THEN
            call create_document_language(in_document_id, var_document_language_id);
        END IF;
    END LOOP;
    
    -- Remove the document languages
    FOREACH var_document_language_id IN ARRAY var_current_document_language_ids
    LOOP
        IF var_document_language_id <> ALL(in_document_language_ids) THEN
            call remove_document_language(in_document_id, var_document_language_id);
        END IF;
    END LOOP;
    
    -- Select the current document document image URLs
    SELECT ARRAY(
        SELECT uuid
        FROM document_images
        WHERE document_id = in_document_id
        AND removed_at IS NULL
    )
    INTO var_current_document_document_image_uuids;
    
    -- Get the length of the document document image UUIDs
    SELECT array_length(in_document_document_image_uuids, 1)
    INTO var_document_document_image_uuids_length;
    
    -- Compare the length of the document document image UUIDs and the document document image extensions
    IF var_document_document_image_uuids_length = array_length(in_document_document_image_extensions, 1) THEN
        FOR i IN 1..var_document_document_image_uuids_length LOOP
            var_document_document_image_uuid := in_document_document_image_uuids[i];
            var_document_document_image_extension := in_document_document_image_extensions[i];
            IF var_document_document_image_uuid <> ALL(var_current_document_document_image_uuids) THEN
                call create_document_image(in_updated_by_user_id, in_document_id, var_document_document_image_uuid, var_document_document_image_extension);
            END IF;
        END LOOP;
        
        -- Remove the document document images
        FOREACH var_document_document_image_uuid IN ARRAY var_current_document_document_image_uuids
        LOOP
            IF var_document_document_image_uuid <> ALL(in_document_document_image_uuids) THEN
                call remove_document_image(in_updated_by_user_id, var_document_document_image_uuid);
            END IF;
        END LOOP;
    END IF;
END;
$$;
`

// Create a stored procedure that removes a document
export const CREATE_REMOVE_DOCUMENT_PROC = `
CREATE OR REPLACE PROCEDURE remove_document(
    IN in_removed_by_user_id BIGINT,
    IN in_document_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the documents table
    UPDATE documents
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE id = in_document_id
    AND removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that creates a new document image
export const CREATE_CREATE_DOCUMENT_IMAGE_PROC = `
CREATE OR REPLACE PROCEDURE create_document_image(
    IN in_created_by_user_id BIGINT,
    IN in_document_id BIGINT,
    IN in_document_image_uuid VARCHAR,
    IN in_document_image_extension VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into document_images table
    INSERT INTO document_images (
        created_by_user_id,
        document_id,
        uuid,
        extension
    )
    VALUES (
        in_created_by_user_id,
        in_document_id,
        in_document_image_uuid,
        in_document_image_extension
    );
END;
$$;
`

// Create a stored procedure that removes a document image
export const CREATE_REMOVE_DOCUMENT_IMAGE_PROC = `
CREATE OR REPLACE PROCEDURE remove_document_image(
    IN in_removed_by_user_id BIGINT,
    IN in_document_image_uuid VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the document_images table
    UPDATE document_images
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE uuid = in_document_image_uuid
    AND removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that creates a new document language
export const CREATE_CREATE_DOCUMENT_LANGUAGE_PROC = `
CREATE OR REPLACE PROCEDURE create_document_language(
    IN in_created_by_user_id BIGINT,
    IN in_document_id BIGINT,
    IN in_language_id BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_document_language_id BIGINT;
BEGIN
    -- Check if the document language already exists
    SELECT id
    INTO var_document_language_id
    FROM document_languages
    WHERE document_id = in_document_id
    AND language_id = in_language_id
    AND removed_at IS NULL;
    
    IF var_document_language_id IS NOT NULL THEN
        RETURN;
    END IF;

    -- Insert into document_languages table
    INSERT INTO document_languages (
        created_by_user_id,
        document_id,
        language_id
    )
    VALUES (
        in_created_by_user_id,
        in_document_id,
        in_language_id
    );
END;
$$;
`

// Create a stored procedure that removes a document language
export const CREATE_REMOVE_DOCUMENT_LANGUAGE_PROC = `
CREATE OR REPLACE PROCEDURE remove_document_language(
    IN in_removed_by_user_id BIGINT,
    IN in_document_id BIGINT,
    IN in_language_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the document_languages table
    UPDATE document_languages
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE document_id = in_document_id
    AND language_id = in_language_id
    AND removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that creates a new post
export const CREATE_CREATE_POST_PROC = `
CREATE OR REPLACE PROCEDURE create_post(
    IN in_created_by_user_id BIGINT,
    IN in_document_id BIGINT,
    IN in_post_available_until TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into posts table
    INSERT INTO posts (
        created_by_user_id,
        document_id,
        available_until
    )
    VALUES (
        in_created_by_user_id,
        in_document_id,
        in_post_available_until
    );
END;
$$;
`

// Create a stored procedure that updates a post
export const CREATE_UPDATE_POST_PROC = `
CREATE OR REPLACE PROCEDURE update_post(
    IN in_post_id BIGINT,
    IN in_post_available_until TIMESTAMP
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_current_post_available_until TIMESTAMP;
BEGIN
    -- Get the current post available until
    SELECT available_until
    INTO var_current_post_available_until
    FROM posts
    WHERE id = in_post_id
    AND removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that removes a post
export const CREATE_REMOVE_POST_PROC = `
CREATE OR REPLACE PROCEDURE remove_post(
    IN in_removed_by_user_id BIGINT,
    IN in_post_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the posts table
    UPDATE posts
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE id = in_post_id
    AND removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that creates a new location
export const CREATE_CREATE_LOCATION_PROC = `
CREATE OR REPLACE PROCEDURE create_location(
    IN in_created_by_user_id BIGINT,
    IN in_location_floor VARCHAR,
    IN in_location_area VARCHAR,
    OUT out_location_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into locations table
    INSERT INTO locations (
        created_by_user_id,
        floor,
        area
    )
    VALUES (
        in_created_by_user_id,
        in_location_floor,
        in_location_area
    )
    RETURNING id INTO out_location_id;
END;
$$;
`

// Create a stored procedure that updates a location
export const CREATE_UPDATE_LOCATION_PROC = `
CREATE OR REPLACE PROCEDURE update_location(
    IN in_location_id BIGINT,
    IN in_location_floor VARCHAR,
    IN in_location_area VARCHAR,
    OUT out_location_id_is_valid BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_current_location_floor VARCHAR;
    var_current_location_area VARCHAR;
BEGIN
    -- Check if the location ID is valid
    SELECT TRUE
    INTO out_location_id_is_valid
    FROM locations
    WHERE id = in_location_id
    AND removed_at IS NULL;
    
    IF out_location_id_is_valid = FALSE THEN
        RETURN;
    END IF;

    -- Get the current location floor and area
    SELECT floor, area
    INTO var_current_location_floor, var_current_location_area
    FROM locations
    WHERE id = in_location_id
    AND removed_at IS NULL;

    -- Update the locations table
    UPDATE locations
    SET floor = COALESCE(in_location_floor, var_current_location_floor),
        area = COALESCE(in_location_area, var_current_location_area)
    WHERE id = in_location_id;
END;
$$;
`

// Create a stored procedure that removes a location
export const CREATE_REMOVE_LOCATION_PROC = `
CREATE OR REPLACE PROCEDURE remove_location(
    IN in_removed_by_user_id BIGINT,
    IN in_location_id BIGINT,
    OUT out_location_id_is_valid BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if the location ID is valid
    SELECT TRUE
    INTO out_location_id_is_valid
    FROM locations
    WHERE id = in_location_id
    AND removed_at IS NULL;
    
    IF out_location_id_is_valid = FALSE THEN
        RETURN;
    END IF;

    -- Update the locations table
    UPDATE locations
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE id = in_location_id
    AND removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that creates a new location section
export const CREATE_CREATE_LOCATION_SECTION_PROC = `
CREATE OR REPLACE PROCEDURE create_location_section(
    IN in_created_by_user_id BIGINT,
    IN in_location_id BIGINT,
    IN in_location_section_name VARCHAR,
    OUT out_location_section_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into location_sections table
    INSERT INTO location_sections (
        created_by_user_id,
        location_id,
        name
    )
    VALUES (
        in_created_by_user_id,
        in_location_id,
        in_location_section_name
    )
    RETURNING id INTO out_location_section_id;
END;
$$;
`

// Create a stored procedure that updates a location section
export const CREATE_UPDATE_LOCATION_SECTION_PROC = `
CREATE OR REPLACE PROCEDURE update_location_section(
    IN in_location_section_id BIGINT,
    IN in_location_section_name VARCHAR,
    OUT out_location_section_id_is_valid BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_current_location_section_name VARCHAR;
BEGIN
    -- Check if the location section ID is valid
    SELECT TRUE
    INTO out_location_section_id_is_valid
    FROM location_sections
    WHERE id = in_location_section_id
    AND removed_at IS NULL;
    
    IF out_location_section_id_is_valid = FALSE THEN
        RETURN;
    END IF;

    -- Get the current location section name
    SELECT name
    INTO var_current_location_section_name
    FROM location_sections
    WHERE id = in_location_section_id
    AND removed_at IS NULL;

    -- Update the location_sections table
    UPDATE location_sections
    SET name = COALESCE(in_location_section_name, var_current_location_section_name)
    WHERE id = in_location_section_id;
END;
$$;
`

// Create a stored procedure that removes a location section
export const CREATE_REMOVE_LOCATION_SECTION_PROC = `
CREATE OR REPLACE PROCEDURE remove_location_section(
    IN in_removed_by_user_id BIGINT,
    IN in_location_section_id BIGINT,
    OUT out_location_section_id_is_valid BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if the location section ID is valid
    SELECT TRUE
    INTO out_location_section_id_is_valid
    FROM location_sections
    WHERE id = in_location_section_id
    AND removed_at IS NULL;
    
    IF out_location_section_id_is_valid = FALSE THEN
        RETURN;
    END IF;

    -- Update the location_sections table
    UPDATE location_sections
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE id = in_location_section_id
    AND removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that creates a location section to a document
export const CREATE_CREATE_DOCUMENT_LOCATION_SECTION_PROC = `
CREATE OR REPLACE PROCEDURE create_document_location_section(
    IN in_created_by_user_id BIGINT,
    IN in_document_id BIGINT,
    IN in_location_section_id BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_document_location_section_id BIGINT;
BEGIN
    -- Check if the document location section already exists
    SELECT id
    INTO var_document_location_section_id
    FROM document_location_sections
    WHERE document_id = in_document_id
    AND location_section_id = in_location_section_id
    AND removed_at IS NULL;
    
    IF var_document_location_section_id IS NOT NULL THEN
        RETURN;
    END IF;

    -- Insert into document_location_sections table
    INSERT INTO document_location_sections (
        created_by_user_id,
        document_id,
        location_section_id
    )
    VALUES (
        in_created_by_user_id,
        in_document_id,
        in_location_section_id
    );
END;
$$;
`

// Create a stored procedure that removes a location section from a document
export const CREATE_REMOVE_DOCUMENT_LOCATION_SECTION_PROC = `
CREATE OR REPLACE PROCEDURE remove_document_location_section(
    IN in_removed_by_user_id BIGINT,
    IN in_document_id BIGINT,
    IN in_location_section_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the document_location_sections table
    UPDATE document_location_sections
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE document_id = in_document_id
    AND location_section_id = in_location_section_id
    AND removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that creates a new topic
export const CREATE_CREATE_TOPIC_PROC = `
CREATE OR REPLACE PROCEDURE create_topic(
    IN in_created_by_user_id BIGINT,
    IN in_topic_name VARCHAR,
    IN in_topic_description TEXT,
    OUT out_topic_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into topics table
    INSERT INTO topics (
        created_by_user_id,
        name,
        description
    )
    VALUES (
        in_created_by_user_id,
        in_topic_name,
        in_topic_description
    )
    RETURNING id INTO out_topic_id;
END;
$$;
`

// Create a stored procedure that updates a topic
export const CREATE_UPDATE_TOPIC_PROC = `
CREATE OR REPLACE PROCEDURE update_topic(
    IN in_topic_id BIGINT,
    IN in_topic_name VARCHAR,
    IN in_topic_description TEXT,
    OUT out_topic_id_is_valid BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_current_topic_name VARCHAR;
    var_current_topic_description TEXT;
BEGIN
    -- Check if the topic ID is valid
    SELECT TRUE
    INTO out_topic_id_is_valid
    FROM topics
    WHERE id = in_topic_id
    AND removed_at IS NULL;
    
    IF out_topic_id_is_valid = FALSE THEN
        RETURN;
    END IF;

    -- Get the current topic name and description
    SELECT name, description
    INTO var_current_topic_name, var_current_topic_description
    FROM topics
    WHERE id = in_topic_id
    AND removed_at IS NULL;

    -- Update the topics table
    UPDATE topics
    SET name = COALESCE(in_topic_name, var_current_topic_name),
        description = COALESCE(in_topic_description, var_current_topic_description)
    WHERE id = in_topic_id;
END;
$$;
`

// Create a stored procedure that removes a topic
export const CREATE_REMOVE_TOPIC_PROC = `
CREATE OR REPLACE PROCEDURE remove_topic(
    IN in_removed_by_user_id BIGINT,
    IN in_topic_id BIGINT,
    OUT out_topic_id_is_valid BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if the topic ID is valid
    SELECT TRUE
    INTO out_topic_id_is_valid
    FROM topics
    WHERE id = in_topic_id
    AND removed_at IS NULL;
    
    IF out_topic_id_is_valid = FALSE THEN
        RETURN;
    END IF;

    -- Update the topics table
    UPDATE topics
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE id = in_topic_id
    AND removed_at IS NULL;
    
    -- Update the document_topics table
    UPDATE document_topics
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE topic_id = in_topic_id
    AND removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that creates a topic to a document
export const CREATE_CREATE_DOCUMENT_TOPIC_PROC = `
CREATE OR REPLACE PROCEDURE create_document_topic(
    IN in_created_by_user_id BIGINT,
    IN in_document_id BIGINT,
    IN in_topic_id BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE 
    var_document_topic_id BIGINT;
BEGIN
    -- Check if the document topic already exists
    SELECT id
    INTO var_document_topic_id
    FROM document_topics
    WHERE document_id = in_document_id
    AND topic_id = in_topic_id
    AND removed_at IS NULL;
    
    IF var_document_topic_id IS NOT NULL THEN
        RETURN;
    END IF;   

    -- Insert into document_topics table
    INSERT INTO document_topics (
        created_by_user_id,
        document_id,
        topic_id
    )
    VALUES (
        in_created_by_user_id,
        in_document_id,
        in_topic_id
    );
END;
$$;
`

// Create a stored procedure that removes a topic from a document
export const CREATE_REMOVE_DOCUMENT_TOPIC_PROC = `
CREATE OR REPLACE PROCEDURE remove_document_topic(
    IN in_removed_by_user_id BIGINT,
    IN in_document_id BIGINT,
    IN in_topic_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the document_topics table
    UPDATE document_topics
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE document_id = in_document_id
    AND topic_id = in_topic_id
    AND removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that creates a new magazine
export const CREATE_CREATE_MAGAZINE_PROC = `
CREATE OR REPLACE PROCEDURE create_magazine(
    IN in_created_by_user_id BIGINT,
    IN in_magazine_name VARCHAR,
    IN in_magazine_description TEXT,
    IN in_magazine_release_date DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into magazines table
    INSERT INTO magazines (
        created_by_user_id,
        name,
        description,
        release_date
    )
    VALUES (
        in_created_by_user_id,
        in_magazine_name,
        in_magazine_description,
        in_magazine_release_date
    );
END;
$$;
`

// Create a stored procedure that updates a magazine
export const CREATE_UPDATE_MAGAZINE_PROC = `
CREATE OR REPLACE PROCEDURE update_magazine(
    IN in_magazine_id BIGINT,
    IN in_magazine_name VARCHAR,
    IN in_magazine_description TEXT,
    IN in_magazine_release_date DATE
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_current_magazine_name VARCHAR;
    var_current_magazine_description TEXT;
    var_current_magazine_release_date DATE;
BEGIN
    -- Get the current magazine name and description
    SELECT name, description, release_date
    INTO var_current_magazine_name, var_current_magazine_description, var_current_magazine_release_date
    FROM magazines
    WHERE id = in_magazine_id
    AND removed_at IS NULL;

    -- Update the magazines table
    UPDATE magazines
    SET name = COALESCE(in_magazine_name, var_current_magazine_name),
        description = COALESCE(in_magazine_description, var_current_magazine_description),
        release_date = COALESCE(in_magazine_release_date, var_current_magazine_release_date)
    WHERE id = in_magazine_id;
END;
$$;
`

// Create a stored procedure that removes a magazine
export const CREATE_REMOVE_MAGAZINE_PROC = `
CREATE OR REPLACE PROCEDURE remove_magazine(
    IN in_removed_by_user_id BIGINT,
    IN in_magazine_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the magazines table
    UPDATE magazines
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE id = in_magazine_id
    AND removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that sets permissions to a profile
export const CREATE_SET_PROFILE_PERMISSIONS_PROC = `
CREATE OR REPLACE PROCEDURE set_profile_permissions(
    IN in_set_by_user_id BIGINT,
    IN in_profile_id BIGINT,
    IN in_create_method_ids BIGINT[],
    IN in_remove_method_ids BIGINT[]
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_method_id BIGINT;
    var_is_profile_id_valid BOOLEAN;
    var_is_method_id_valid BOOLEAN;
    var_permission_id BIGINT;
BEGIN
    -- Assign methods
    IF in_create_method_ids IS NOT NULL THEN
        FOREACH var_method_id IN ARRAY in_create_method_ids
        LOOP
            call create_profile_permission(in_set_by_user_id, in_profile_id, var_method_id, var_is_profile_id_valid, var_is_method_id_valid, var_permission_id);
        END LOOP;
    END IF;
    
    -- Remove permissions
    IF in_remove_method_ids IS NOT NULL THEN
        FOREACH var_method_id IN ARRAY in_remove_method_ids
        LOOP
            call remove_profile_permission(in_set_by_user_id, in_profile_id, var_method_id, var_is_profile_id_valid, var_is_method_id_valid, var_permission_id);
        END LOOP;
    END IF;
END;
$$;
`

// Create a stored procedure that creates a new publisher
export const CREATE_CREATE_PUBLISHER_PROC = `
CREATE OR REPLACE PROCEDURE create_publisher(
    IN in_created_by_user_id BIGINT,
    IN in_publisher_name VARCHAR,
    IN in_publisher_description TEXT,
    OUT out_publisher_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into publishers table
    INSERT INTO publishers (
        created_by_user_id,
        name,
        description
    )
    VALUES (
        in_created_by_user_id,
        in_publisher_name,
        in_publisher_description
    )
    RETURNING id INTO out_publisher_id;
END;
$$;
`

// Create a stored procedure that updates a publisher
export const CREATE_UPDATE_PUBLISHER_PROC = `
CREATE OR REPLACE PROCEDURE update_publisher(
    IN in_publisher_id BIGINT,
    IN in_publisher_name VARCHAR,
    IN in_publisher_description TEXT,
    OUT out_publisher_id_is_valid BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_current_publisher_name VARCHAR;
    var_current_publisher_description TEXT;
BEGIN
    -- Check if the publisher ID is valid
    SELECT TRUE
    INTO out_publisher_id_is_valid
    FROM publishers
    WHERE id = in_publisher_id
    AND removed_at IS NULL;
    
    IF out_publisher_id_is_valid = FALSE THEN
        RETURN;
    END IF;

    -- Get the current publisher name and description
    SELECT name, description
    INTO var_current_publisher_name, var_current_publisher_description
    FROM publishers
    WHERE id = in_publisher_id
    AND removed_at IS NULL;

    -- Update the publishers table
    UPDATE publishers
    SET name = COALESCE(in_publisher_name, var_current_publisher_name),
        description = COALESCE(in_publisher_description, var_current_publisher_description)
    WHERE id = in_publisher_id;
END;
$$;
`

// Create a stored procedure that removes a publisher
export const CREATE_REMOVE_PUBLISHER_PROC = `
CREATE OR REPLACE PROCEDURE remove_publisher(
    IN in_removed_by_user_id BIGINT,
    IN in_publisher_id BIGINT,
    OUT out_publisher_id_is_valid BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if the publisher ID is valid
    SELECT TRUE
    INTO out_publisher_id_is_valid
    FROM publishers
    WHERE id = in_publisher_id
    AND removed_at IS NULL;
    
    IF out_publisher_id_is_valid = FALSE THEN
        RETURN;
    END IF;

    -- Update the publishers table
    UPDATE publishers
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE id = in_publisher_id
    AND removed_at IS NULL;
END;
$$;
`

// Query to create a stored procedure that creates a new document review
export const CREATE_CREATE_DOCUMENT_REVIEW_PROC = `
CREATE OR REPLACE PROCEDURE create_document_review(
    IN in_created_by_user_id BIGINT,
    IN in_document_id BIGINT,
    IN in_review_title VARCHAR,
    IN in_review_content TEXT,
    IN in_review_rating SMALLINT,
    IN in_review_parent_document_review_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into document_reviews table
    INSERT INTO document_reviews (
        created_by_user_id,
        document_id,
        title,
        content,
        rating,
        parent_document_review_id
    )
    VALUES (
        in_created_by_user_id,
        in_document_id,
        in_review_title,
        in_review_content,
        in_review_rating,
        in_review_parent_document_review_id
    );
END;
$$;
`

// Query to create a stored procedure that updates a document review
export const CREATE_UPDATE_DOCUMENT_REVIEW_PROC = `
CREATE OR REPLACE PROCEDURE update_document_review(
    IN in_review_id BIGINT,
    IN in_review_title VARCHAR,
    IN in_review_content TEXT,
    IN in_review_rating SMALLINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_current_review_title VARCHAR;
    var_current_review_content TEXT;
    var_current_review_rating SMALLINT;
BEGIN
    -- Get the current review title, content and rating
    SELECT title, content, rating
    INTO var_current_review_title, var_current_review_content, var_current_review_rating
    FROM document_reviews
    WHERE id = in_review_id
    AND removed_at IS NULL;

    -- Update the document_reviews table
    UPDATE document_reviews
    SET title = COALESCE(in_review_title, var_current_review_title),
        content = COALESCE(in_review_content, var_current_review_content),
        rating = COALESCE(in_review_rating, var_current_review_rating),
        updated_at = NOW()
    WHERE id = in_review_id;
END;
$$;
`

// Query to create a stored procedure that removes a document review
export const CREATE_REMOVE_DOCUMENT_REVIEW_PROC = `
CREATE OR REPLACE PROCEDURE remove_document_review(
    IN in_removed_by_user_id BIGINT,
    IN in_review_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the document_reviews table
    UPDATE document_reviews
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE id = in_review_id
    AND removed_at IS NULL;
END;
$$;
`

// Query to create a stored procedure that gets a document ID by book ID
export const CREATE_GET_DOCUMENT_ID_BY_BOOK_ID_PROC = `
CREATE OR REPLACE PROCEDURE get_document_id_by_book_id(
    IN in_book_id BIGINT,
    OUT out_document_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Select the document ID
    SELECT document_id
    INTO out_document_id
    FROM books
    WHERE id = in_book_id
    AND removed_at IS NULL;
END;
$$;
`

// Query to create a stored procedure that creates a new book
export const CREATE_CREATE_BOOK_PROC = `
CREATE OR REPLACE PROCEDURE create_book(
    IN in_registered_by_user_id BIGINT,
    IN in_document_title VARCHAR,
    IN in_document_description TEXT,
    IN in_document_release_date DATE,
    IN in_document_pages BIGINT,
    IN in_document_author VARCHAR,
    IN in_document_topic_ids BIGINT[],
    IN in_document_location_section_ids BIGINT[],
    IN in_document_language_ids BIGINT[],
    IN in_document_document_image_uuids VARCHAR[],
    IN in_document_document_image_extensions VARCHAR[],
    IN in_book_isbn VARCHAR,
    IN in_book_publisher_id BIGINT,
    OUT out_book_id BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_document_id BIGINT;
BEGIN
    -- Insert into documents table
    call create_document(in_registered_by_user_id, in_document_title, in_document_description, in_document_release_date, in_document_pages, in_document_author, in_document_topic_ids, in_document_location_section_ids, in_document_language_ids, in_document_document_image_uuids,in_document_document_image_extensions, var_document_id);
    
    -- Insert into books table
    INSERT INTO books (
        document_id,
        publisher_id,
        isbn
    )
    VALUES (
        var_document_id,
        in_book_publisher_id,
        in_book_isbn
    )
    RETURNING id INTO out_book_id;
END;
$$;
`

// Query to create a stored procedure that updates a book
export const CREATE_UPDATE_BOOK_PROC = `
CREATE OR REPLACE PROCEDURE update_book(
    IN in_updated_by_user_id BIGINT,
    IN in_book_id BIGINT,
    IN in_document_title VARCHAR,
    IN in_document_description TEXT,
    IN in_document_release_date DATE,
    IN in_document_pages BIGINT,
    IN in_document_author VARCHAR,
    IN in_document_topic_ids BIGINT[],
    IN in_document_location_section_ids BIGINT[],
    IN in_document_language_ids BIGINT[],
    IN in_document_document_image_uuids VARCHAR[],
    IN in_document_document_image_extensions VARCHAR[],
    IN in_book_isbn VARCHAR,
    IN in_book_publisher_id BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_document_id BIGINT;
    var_current_book_isbn VARCHAR;
    var_current_book_publisher_id BIGINT;
BEGIN
    -- Get the document ID
    call get_document_id_by_book_id(in_book_id, var_document_id);
    
    -- Update the documents table
    call update_document(in_updated_by_user_id, var_document_id, in_document_title, in_document_description, in_document_release_date, in_document_pages, in_document_author, in_document_topic_ids, in_document_location_section_ids, in_document_language_ids, in_document_document_image_uuids, in_document_document_image_extensions);
    
    -- Select the current book ISBN and publisher ID
    SELECT books.isbn, books.publisher_id
    INTO var_current_book_isbn, var_current_book_publisher_id
    FROM books
    INNER JOIN documents ON books.document_id = documents.id
    WHERE books.id = in_book_id
    AND documents.removed_at IS NULL;
    
    -- Update the books table
    UPDATE books
    SET publisher_id = COALESCE(in_book_publisher_id, var_current_book_publisher_id),
        isbn = COALESCE(in_book_isbn, var_current_book_isbn)
    WHERE books.id = in_book_id;
END;
$$;
`

// Query to create a stored procedure that creates a new work
export const CREATE_CREATE_WORK_PROC = `
CREATE OR REPLACE PROCEDURE create_work(
    IN in_registered_by_user_id BIGINT,
    IN in_document_title VARCHAR,
    IN in_document_description TEXT,
    IN in_document_release_date DATE,
    IN in_document_pages BIGINT,
    IN in_document_author VARCHAR,
    IN in_document_topic_ids BIGINT[],
    IN in_document_location_section_ids BIGINT[],
    IN in_document_language_ids BIGINT[],
    IN in_document_document_image_uuids VARCHAR[],
    IN in_document_document_image_extensions VARCHAR[],
    OUT out_work_id BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_document_id BIGINT;
BEGIN
    -- Insert into documents table
    call create_document(in_registered_by_user_id, in_document_title, in_document_description, in_document_release_date, in_document_pages, in_document_author, in_document_topic_ids, in_document_location_section_ids, in_document_language_ids, in_document_document_image_uuids, in_document_document_image_extensions, var_document_id);
    
    -- Insert into works table
    INSERT INTO works (
        document_id
    )
    VALUES (
        var_document_id
    )
    RETURNING id INTO out_work_id;
END;
$$;
`

// Query to create a stored procedure that gets a work ID by document ID
export const CREATE_GET_WORK_ID_BY_DOCUMENT_ID_PROC = `
CREATE OR REPLACE PROCEDURE get_work_by_document_id(
    IN in_document_id BIGINT,
    OUT out_work_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Select the document ID
    SELECT document_id
    INTO out_work_id
    FROM works
    WHERE id = in_work_id
    AND removed_at IS NULL;
END;
$$;
`

// Query to create a stored procedure that gets a document ID by work ID
export const CREATE_GET_DOCUMENT_ID_BY_WORK_ID_PROC = `
CREATE OR REPLACE PROCEDURE get_document_id_by_work_id(
    IN in_work_id BIGINT,
    OUT out_document_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Select the document ID
    SELECT document_id
    INTO out_document_id
    FROM works
    WHERE id = in_work_id
    AND removed_at IS NULL;
END;
$$;
`

// Query to create a stored procedure that updates a work
export const CREATE_UPDATE_WORK_PROC = `
CREATE OR REPLACE PROCEDURE update_work(
    IN in_updated_by_user_id BIGINT,
    IN in_work_id BIGINT,
    IN in_document_title VARCHAR,
    IN in_document_description TEXT,
    IN in_document_release_date DATE,
    IN in_document_pages BIGINT,
    IN in_document_author VARCHAR,
    IN in_document_topic_ids BIGINT[],
    IN in_document_location_section_ids BIGINT[],
    IN in_document_language_ids BIGINT[],
    IN in_document_document_image_uuids VARCHAR[],
    IN in_document_document_image_extensions VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_document_id BIGINT;
BEGIN
    -- Get the document ID
    call get_document_id_by_work_id(in_work_id, var_document_id);
    
    -- Update the documents table
    call update_document(in_updated_by_user_id, var_document_id, in_document_title, in_document_description, in_document_release_date, in_document_pages, in_document_author, in_document_topic_ids, in_document_location_section_ids, in_document_language_ids, in_document_document_image_uuids, in_document_document_image_extensions);
END;
$$;
`

// Query to create a stored procedure that creates a new article
export const CREATE_CREATE_ARTICLE_PROC = `
CREATE OR REPLACE PROCEDURE create_article(
    IN in_registered_by_user_id BIGINT,
    IN in_document_title VARCHAR,
    IN in_document_description TEXT,
    IN in_document_release_date DATE,
    IN in_document_pages BIGINT,
    IN in_document_author VARCHAR,
    IN in_document_topic_ids BIGINT[],
    IN in_document_location_section_ids BIGINT[],
    IN in_document_language_ids BIGINT[],
    IN in_document_document_image_uuids VARCHAR[],
    IN in_document_document_image_extensions VARCHAR[],
    OUT out_article_id BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_work_id BIGINT;
BEGIN
    -- Create the work
    call create_work(in_registered_by_user_id, in_document_title, in_document_description, in_document_release_date, in_document_pages, in_document_author, in_document_topic_ids, in_document_location_section_ids, in_document_language_ids, in_document_document_image_uuids, in_document_document_image_extensions, var_work_id);
    
    -- Insert into articles table
    INSERT INTO articles (
        work_id
    )
    VALUES (
        var_work_id
    )
    RETURNING id INTO out_article_id;
END;
$$;
`

// Query to create a stored procedure that updates an article
export const CREATE_UPDATE_ARTICLE_PROC = `
CREATE OR REPLACE PROCEDURE update_article(
    IN in_updated_by_user_id BIGINT,
    IN in_article_id BIGINT,
    IN in_document_title VARCHAR,
    IN in_document_description TEXT,
    IN in_document_release_date DATE,
    IN in_document_pages BIGINT,
    IN in_document_author VARCHAR,
    IN in_document_topic_ids BIGINT[],
    IN in_document_location_section_ids BIGINT[],
    IN in_document_language_ids BIGINT[],
    IN in_document_document_image_uuids VARCHAR[],
    IN in_document_document_image_extensions VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_work_id BIGINT;
BEGIN
    -- Get the work ID
    call get_work_by_document_id(in_article_id, var_work_id);
    
    -- Update the work
    call update_work(in_updated_by_user_id, var_work_id, in_document_title, in_document_description, in_document_release_date, in_document_pages, in_document_author, in_document_topic_ids, in_document_location_section_ids, in_document_language_ids, in_document_document_image_uuids, in_document_document_image_extensions);
END;
$$;
`

// Query to create a stored procedure that creates a new book copy
export const CREATE_CREATE_BOOK_COPY_PROC = `
CREATE OR REPLACE PROCEDURE create_book_copy(
    IN in_created_by_user_id BIGINT,
    IN in_book_id BIGINT,
    IN in_book_copy_uuid VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into book_copies table
    INSERT INTO book_copies (
        created_by_user_id,
        book_id,
        uuid
    )
    VALUES (
        in_created_by_user_id,
        in_book_id,
        in_book_copy_uuid
    );
END;
$$;
`

// Query to create a stored procedure that updates a book copy
export const CREATE_UPDATE_BOOK_COPY_PROC = `
CREATE OR REPLACE PROCEDURE update_book_copy(
    IN in_book_copy_id BIGINT,
    IN in_book_copy_uuid VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_current_book_copy_uuid VARCHAR;
BEGIN
    -- Get the current book copy UUID
    SELECT uuid
    INTO var_current_book_copy_uuid
    FROM book_copies
    WHERE id = in_book_copy_id
    AND removed_at IS NULL;

    -- Update the book_copies table
    UPDATE book_copies
    SET uuid = COALESCE(in_book_copy_uuid, var_current_book_copy_uuid)
    WHERE id = in_book_copy_id;
END;
$$;
`

// Query to create a stored procedure that removes a book copy
export const CREATE_REMOVE_BOOK_COPY_PROC = `
CREATE OR REPLACE PROCEDURE remove_book_copy(
    IN in_removed_by_user_id BIGINT,
    IN in_book_copy_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the book_copies table
    UPDATE book_copies
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE id = in_book_copy_id
    AND removed_at IS NULL;
END;
$$;
`

// Query to create a stored procedure that creates a new magazine issue
export const CREATE_CREATE_MAGAZINE_ISSUE_PROC = `
CREATE OR REPLACE PROCEDURE create_magazine_issue(
    IN in_registered_by_user_id BIGINT,
    IN in_document_title VARCHAR,
    IN in_document_description TEXT,
    IN in_document_release_date DATE,
    IN in_document_pages BIGINT,
    IN in_document_author VARCHAR,
    IN in_document_topic_ids BIGINT[],
    IN in_document_location_section_ids BIGINT[],
    IN in_document_language_ids BIGINT[],
    IN in_document_document_image_uuids VARCHAR[],
    IN in_document_document_image_extensions VARCHAR[],
    IN in_magazine_id BIGINT,
    IN in_magazine_issue_number BIGINT,
    OUT out_magazine_issue_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Create the work
    call create_work(in_registered_by_user_id, in_document_title, in_document_description, in_document_release_date, in_document_pages, in_document_author, in_document_topic_ids, in_document_location_section_ids, in_document_language_ids, in_document_document_image_uuids, in_document_document_image_extensions, var_work_id);
    
    -- Insert into magazine_issues table
    INSERT INTO magazine_issues (
        work_id,
        magazine_id,
        issue_number
    )
    VALUES (
        var_work_id,
        in_magazine_id,
        in_magazine_issue_number
    )
    RETURNING id INTO out_magazine_issue_id;
END;
$$;
`

// Query to create a stored procedure that updates a magazine issue
export const CREATE_UPDATE_MAGAZINE_ISSUE_PROC = `
CREATE OR REPLACE PROCEDURE update_magazine_issue(
    IN in_updated_by_user_id BIGINT,
    IN in_magazine_issue_id BIGINT,
    IN in_document_title VARCHAR,
    IN in_document_description TEXT,
    IN in_document_release_date DATE,
    IN in_document_pages BIGINT,
    IN in_document_author VARCHAR,
    IN in_document_topic_ids BIGINT[],
    IN in_document_location_section_ids BIGINT[],
    IN in_document_language_ids BIGINT[],
    IN in_document_document_image_uuids VARCHAR[],
    IN in_document_document_image_extensions VARCHAR,
    IN in_magazine_issue_number BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_work_id BIGINT;
    var_current_magazine_issue_number BIGINT;
BEGIN
    -- Get the work ID
    call get_work_by_document_id(in_magazine_issue_id, var_work_id);
    
    -- Update the work
    call update_work(in_updated_by_user_id, var_work_id, in_document_title, in_document_description, in_document_release_date, in_document_pages, in_document_author, in_document_topic_ids, in_document_location_section_ids, in_document_language_ids, in_document_document_image_uuids, in_document_document_image_extensions);
    
    -- Select the current magazine issue number
    SELECT issue_number
    INTO var_current_magazine_issue_number
    FROM magazine_issues
    INNER JOIN works ON magazine_issues.work_id = works.id
    INNER JOIN documents ON works.document_id = documents.id
    WHERE magazine_issues.id = in_magazine_issue_id
    AND documents.removed_at IS NULL;
    
    -- Update the magazine_issues table
    UPDATE magazine_issues
    SET issue_number = COALESCE(in_magazine_issue_number, var_current_magazine_issue_number)
    WHERE work_id = var_work_id;
END;
$$;
`

// Query to create a stored procedure that creates a new thesis
export const CREATE_CREATE_THESIS_PROC = `
CREATE OR REPLACE PROCEDURE create_thesis(
    IN in_registered_by_user_id BIGINT,
    IN in_document_title VARCHAR,
    IN in_document_description TEXT,
    IN in_document_release_date DATE,
    IN in_document_pages BIGINT,
    IN in_document_author VARCHAR,
    IN in_document_topic_ids BIGINT[],
    IN in_document_location_section_ids BIGINT[],
    IN in_document_language_ids BIGINT[],
    IN in_document_document_image_uuids VARCHAR[],
    IN in_document_document_image_extensions VARCHAR[],
    OUT out_thesis_id BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_document_id BIGINT;
    var_work_id BIGINT;
BEGIN
    -- Create the work
    call create_work(in_registered_by_user_id, in_document_title, in_document_description, in_document_release_date, in_document_pages, in_document_author, in_document_topic_ids, in_document_location_section_ids, in_document_language_ids, in_document_document_image_uuids, in_document_document_image_extensions, var_work_id);
    
    -- Insert into theses table
    INSERT INTO theses (
        work_id
    )
    VALUES (
        var_work_id
    )
    RETURNING id INTO out_thesis_id;
END;
$$;
`

// Query to create a stored procedure that updates a thesis
export const CREATE_UPDATE_THESIS_PROC = `
CREATE OR REPLACE PROCEDURE update_thesis(
    IN in_updated_by_user_id BIGINT,
    IN in_thesis_id BIGINT,
    IN in_document_title VARCHAR,
    IN in_document_description TEXT,
    IN in_document_release_date DATE,
    IN in_document_pages BIGINT,
    IN in_document_author VARCHAR,
    IN in_document_topic_ids BIGINT[],
    IN in_document_location_section_ids BIGINT[],
    IN in_document_language_ids BIGINT[],
    IN in_document_document_image_uuids VARCHAR[],
    IN in_document_document_image_extensions VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_work_id BIGINT;
BEGIN
    -- Get the work ID
    call get_work_by_document_id(in_thesis_id, var_work_id);
    
    -- Update the work
    call update_work(in_updated_by_user_id, var_work_id, in_document_title, in_document_description, in_document_release_date, in_document_pages, in_document_author, in_document_topic_ids, in_document_location_section_ids, in_document_language_ids, in_document_document_image_uuids, in_document_document_image_extensions);
END;
$$;
`

// Query to create a stored procedure that gets the user details by user ID
export const CREATE_GET_USER_DETAILS_BY_USER_ID_PROC = `
CREATE OR REPLACE PROCEDURE get_user_details_by_user_id(
    IN in_user_id BIGINT,
    OUT out_user_id BIGINT,
    OUT out_user_first_name VARCHAR,
    OUT out_user_last_name VARCHAR,
    OUT out_user_email VARCHAR,
    OUT out_user_username VARCHAR,
    OUT out_user_birthdate DATE,
    OUT out_user_profile_ids BIGINT[],
    OUT out_user_document_country VARCHAR,
    OUT out_user_document_type VARCHAR,
    OUT out_user_document_number VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Query to select the user profile IDs by user ID
    SELECT ARRAY(
        SELECT profile_id
        FROM user_profiles
        WHERE user_profiles.user_id = in_user_id 
        AND removed_at IS NULL
    )
    INTO out_user_profile_ids;
    
    -- Query to select the document country by user ID
    SELECT 
        CASE 
            WHEN people.identity_document_id IS NOT NULL THEN (
                SELECT name
                FROM countries
                INNER JOIN identity_documents
                ON countries.id = identity_documents.country_id
                WHERE identity_documents.id = people.identity_document_id
                AND identity_documents.removed_at IS NULL
            )
            ELSE (
                SELECT name
                FROM countries
                INNER JOIN passports
                ON countries.id = passports.country_id
                WHERE passports.id = people.passport_id
                AND passports.removed_at IS NULL
            )
        END AS document_country,
        CASE 
            WHEN people.passport_id IS NOT NULL THEN 'Passport'
            ELSE 'Identity Document'
        END AS document_type,
        CASE
            WHEN people.passport_id IS NOT NULL THEN (
                SELECT passport_number
                FROM passports
                INNER JOIN people AS p ON p.passport_id = passports.id
                WHERE passports.id = people.passport_id
                AND passports.removed_at IS NULL
            )
            ELSE (
                SELECT identity_document_number
                FROM identity_documents
                INNER JOIN people AS p ON p.identity_document_id = identity_documents.id
                WHERE identity_documents.id = people.identity_document_id
                AND identity_documents.removed_at IS NULL
            )
        END AS document_number
    INTO out_user_document_country, out_user_document_type, out_user_document_number
    FROM users
    INNER JOIN people ON users.person_id = people.id
    WHERE users.id = in_user_id
    AND people.removed_at IS NULL;

    -- Query to select the user details by user ID
    SELECT users.id, people.first_name, people.last_name, user_emails.email, user_usernames.username, people.birthdate
    INTO out_user_id, out_user_first_name, out_user_last_name, out_user_email, out_user_username, out_user_birthdate
    FROM users
    INNER JOIN people
    ON users.person_id = people.id
    INNER JOIN user_emails
    ON users.id = user_emails.user_id
    INNER JOIN user_usernames
    ON users.id = user_usernames.user_id
    WHERE users.id = in_user_id
    AND user_emails.removed_at IS NULL
    AND user_usernames.removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that set the method permissions
export const CREATE_SET_METHOD_PERMISSIONS_PROC = `
CREATE OR REPLACE PROCEDURE set_method_permissions(
    IN in_set_by_user_id BIGINT,
    IN in_method_id BIGINT,
    IN in_allowed_profile_ids BIGINT[]
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_profile_id BIGINT;
BEGIN
    -- Remove all permissions
    UPDATE permissions
    SET removed_at = NOW(),
        removed_by_user_id = in_set_by_user_id
    WHERE method_id = in_method_id
    AND removed_at IS NULL;
    
    -- Assign permissions
    IF in_allowed_profile_ids IS NOT NULL THEN
        FOREACH var_profile_id IN ARRAY in_allowed_profile_ids
        LOOP
            INSERT INTO permissions (
                profile_id,
                method_id,
                created_by_user_id
            )
            VALUES (
                var_profile_id,
                in_method_id,
                in_set_by_user_id
            );
        END LOOP;
    END IF;
END;
$$;
`

// Create a stored procedure that creates a new audit entry
export const CREATE_CREATE_AUDIT_ENTRY_PROC = `
CREATE OR REPLACE PROCEDURE create_audit_entry(
    IN in_user_id BIGINT,
    IN in_profile_id BIGINT,
    IN in_body JSONB,
    IN in_ip_address VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into audit_entries table
    INSERT INTO audit_entries (
        user_id,
        profile_id,
        body,
        ip_address
    )
    VALUES (
        in_user_id,
        in_profile_id,
        in_body,
        in_ip_address
    );
END;
$$;
`

// Create a stored procedure that creates a jury member to an article
export const CREATE_CREATE_ARTICLE_JURY_MEMBER_PROC = `
CREATE OR REPLACE PROCEDURE create_article_jury_member(
    IN in_created_by_user_id BIGINT,
    IN in_article_id BIGINT,
    IN in_jury_member_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into article_jury_members table
    INSERT INTO article_jury_members (
        created_by_user_id,
        article_id,
        jury_member_id
    )
    VALUES (
        in_created_by_user_id,
        in_article_id,
        in_jury_member_id
    );
END;
$$;
`

// Create a stored procedure that removes a jury member from an article
export const CREATE_REMOVE_ARTICLE_JURY_MEMBER_PROC = `
CREATE OR REPLACE PROCEDURE remove_article_jury_member(
    IN in_removed_by_user_id BIGINT,
    IN in_article_id BIGINT,
    IN in_jury_member_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the article_jury_members table
    UPDATE article_jury_members
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE article_id = in_article_id
    AND jury_member_id = in_jury_member_id
    AND removed_at IS NULL;
END;
$$;
`

// Create a stored procedure that creates a new article annotation
export const CREATE_CREATE_ARTICLE_ANNOTATION_PROC = `
CREATE OR REPLACE PROCEDURE create_article_annotation(
    IN in_created_by_jury_id BIGINT,
    IN in_article_id BIGINT,
    IN in_annotation_title VARCHAR,
    IN in_annotation_content TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into article_annotations table
    INSERT INTO article_annotations (
        created_by_jury_id,
        article_id,
        title,
        content
    )
    VALUES (
        in_created_by_jury_id,
        in_article_id,
        in_annotation_title,
        in_annotation_content
    );
END;
$$;
`

// Create a stored procedure that updates an article annotation
export const CREATE_UPDATE_ARTICLE_ANNOTATION_PROC = `
CREATE OR REPLACE PROCEDURE update_article_annotation(
    IN in_annotation_id BIGINT,
    IN in_annotation_title VARCHAR,
    IN in_annotation_content TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_current_annotation_title VARCHAR;
    var_current_annotation_content TEXT;
BEGIN
    -- Get the current annotation title and content
    SELECT title, content
    INTO var_current_annotation_title, var_current_annotation_content
    FROM article_annotations
    WHERE id = in_annotation_id
    AND removed_at IS NULL;

    -- Update the article_annotations table
    UPDATE article_annotations
    SET title = COALESCE(in_annotation_title, var_current_annotation_title),
        content = COALESCE(in_annotation_content, var_current_annotation_content)
    WHERE id = in_annotation_id;
END;
$$;
`

// Create a stored procedure that marks as resolved an article annotation
export const CREATE_RESOLVE_ARTICLE_ANNOTATION_PROC = `
CREATE OR REPLACE PROCEDURE resolve_article_annotation(
    IN in_resolved_by_user_id BIGINT,
    IN in_annotation_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the article_annotations table
    UPDATE article_annotations
    SET resolved_at = NOW(),
        resolved_by_user_id = in_resolved_by_user_id
    WHERE id = in_annotation_id
    AND resolved_at IS NULL;
END;
$$;
`

// Create a stored procedure that sets a book copy as lost
export const CREATE_SET_BOOK_COPY_AS_LOST_PROC = `
CREATE OR REPLACE PROCEDURE set_book_copy_as_lost(
    IN in_lost_by_user_id BIGINT,
    IN in_book_copy_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the book_copies table
    UPDATE book_copies
    SET lost_at = NOW(),
        lost_by_user_id = in_lost_by_user_id
    WHERE id = in_book_copy_id
    AND lost_at IS NULL;
END;
$$;
`

// Create a stored procedure that registers a new book copy loan with reservation
export const CREATE_REGISTER_BOOK_COPY_LOAN_WITH_RESERVATION_PROC = `
CREATE OR REPLACE PROCEDURE register_book_copy_loan_with_reservation(
    IN in_loaned_to_user_id BIGINT,
    IN in_book_copy_id BIGINT,
    IN in_loan_reserved_at TIMESTAMP,
    IN in_loan_reserved_until DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into book_copy_loans table
    INSERT INTO book_copy_loans (
        loaned_to_user_id,
        book_copy_id,
        reserved_at,
        reserved_until
    )
    VALUES (
        in_loaned_to_user_id,
        in_book_copy_id,
        in_loan_reserved_at,
        in_loan_reserved_until
    );
END;
$$;
`

// Create a stored procedure that sets the book copy loan reservation as borrowed
export const CREATE_SET_BOOK_COPY_LOAN_RESERVATION_AS_BORROWED_PROC = `
CREATE OR REPLACE PROCEDURE set_book_copy_loan_reservation_as_borrowed(
    IN in_loaned_by_user_id BIGINT,
    IN in_book_copy_id BIGINT,
    IN in_loan_borrowed_at TIMESTAMP,
    IN in_loan_borrowed_until DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the book_copy_loans table
    UPDATE book_copy_loans
    SET borrowed_at = in_loan_borrowed_at,
        borrowed_until = in_loan_borrowed_until,
        loaned_by_user_id = in_loaned_by_user_id
    WHERE book_copy_id = in_book_copy_id
    AND borrowed_at IS NULL;
END;
$$;
`

// Create a stored procedure that registers a new book copy loan without reservation
export const CREATE_REGISTER_BOOK_COPY_LOAN_WITHOUT_RESERVATION_PROC = `
CREATE OR REPLACE PROCEDURE register_book_copy_loan_without_reservation(
    IN in_loaned_to_user_id BIGINT,
    IN in_loaned_by_user_id BIGINT,
    IN in_book_copy_id BIGINT,
    IN in_loan_borrowed_at TIMESTAMP,
    IN in_loan_borrowed_until DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into book_copy_loans table
    INSERT INTO book_copy_loans (
        loaned_to_user_id,
        loaned_by_user_id,
        book_copy_id,
        borrowed_at,
        borrowed_until
    )
    VALUES (
        in_loaned_to_user_id,
        in_loaned_by_user_id,
        in_book_copy_id,
        in_loan_borrowed_at,
        in_loan_borrowed_until
    );
END;
$$;
`

// Create a stored procedure that sets the book copy loan as returned
export const CREATE_SET_BOOK_COPY_LOAN_AS_RETURNED_PROC = `
CREATE OR REPLACE PROCEDURE set_book_copy_loan_as_returned(
    IN in_book_copy_loan_id BIGINT,
    IN in_loan_returned_at TIMESTAMP,
    IN in_loan_penalty DOUBLE PRECISION,
    IN in_loan_damaged BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the book_copy_loans table
    UPDATE book_copy_loans
    SET returned_at = in_loan_returned_at,
        penalty = in_loan_penalty,
        damaged = in_loan_damaged
    WHERE id = in_book_copy_loan_id
    AND returned_at IS NULL;
END;
$$;
`

// Create a stored procedure that sets the book copy loan as lost
export const CREATE_SET_BOOK_COPY_LOAN_AS_LOST_PROC = `
CREATE OR REPLACE PROCEDURE set_book_copy_loan_as_lost(
    IN in_book_copy_loan_id BIGINT,
    IN in_loan_lost_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_book_copy_id BIGINT;
    var_loaned_to_user_id BIGINT;
BEGIN
    -- Get the book copy ID and loaned to user ID
    SELECT book_copy_id, loaned_to_user_id
    INTO var_book_copy_id, var_loaned_to_user_id
    FROM book_copy_loans
    WHERE id = in_book_copy_loan_id
    AND lost_at IS NOT NULL;
    
    -- Update the book_copy_loans table
    UPDATE book_copy_loans
    SET lost_at = in_loan_lost_at
    WHERE id = in_book_copy_loan_id
    AND lost_at IS NULL;
    
    -- Update the book_copies table
    call set_book_copy_as_lost(var_loaned_to_user_id, var_book_copy_id);
END;
$$;
`

// Create a stored procedure that removes a book copy loan
export const CREATE_REMOVE_BOOK_COPY_LOAN_PROC = `
CREATE OR REPLACE PROCEDURE remove_book_copy_loan(
    IN in_removed_by_user_id BIGINT,
    IN in_book_copy_loan_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the book_copy_loans table
    UPDATE book_copy_loans
    SET removed_at = NOW(),
        removed_by_user_id = in_removed_by_user_id
    WHERE id = in_book_copy_loan_id
    AND removed_at IS NULL;
END;
$$;
`
