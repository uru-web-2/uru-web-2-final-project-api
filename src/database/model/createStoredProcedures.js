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
    IF in_user_document_type = 'identity_document' THEN
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

// Create a stored procedure that deletes a user personal document
export const CREATE_DELETE_USER_PERSONAL_DOCUMENT_PROC = `
CREATE OR REPLACE PROCEDURE delete_user_personal_document(
    IN in_deleted_by_user_id BIGINT,
    IN in_user_document_type VARCHAR,
    IN in_user_document_number VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Delete the user personal document
    IF in_user_document_type = 'identity_document' THEN
        UPDATE identity_documents
        SET deleted_at = NOW(),
            deleted_by_user_id = in_deleted_by_user_id
        WHERE identity_document_number = in_user_document_number
        AND revoked_at IS NULL;
    ELSE
        UPDATE passports
        SET deleted_at = NOW(),
            deleted_by_user_id = in_deleted_by_user_id
        WHERE passport_number = in_user_document_number
        AND revoked_at IS NULL;
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
    call delete_user_personal_document(in_replaced_by_user_id, in_user_document_type, in_user_document_number);
    
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
    IF in_user_document_type = 'identity_document' THEN        
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
    SET revoked_at = NOW()
    WHERE user_id = in_user_id
    AND revoked_at IS NULL;
    
    -- Create the user email
    call create_user_email(in_user_id, in_user_email, in_user_email_verification_token, in_user_email_verification_expires_at, out_user_email_id);
END;
$$;
`


// Create a stored procedure that revokes a user email verification token by user email ID
export const CREATE_REVOKE_USER_EMAIL_VERIFICATION_TOKEN_BY_USER_EMAIL_ID_PROC = `
CREATE OR REPLACE PROCEDURE revoke_user_email_verification_token_by_user_email_id(
    IN in_user_email_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the user_email_verification_tokens table
    UPDATE user_email_verification_tokens
    SET revoked_at = NOW()
    WHERE user_email_id = in_user_email_id
    AND revoked_at IS NULL
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
    AND revoked_at IS NULL;
    
    IF out_user_email_is_verified = TRUE THEN
        RETURN;
    END IF;

    -- Revoke the user email verification
    call revoke_user_email_verification_token_by_user_email_id(in_user_email_id);

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

// Create a stored procedure that revokes a user reset password token by user ID
export const CREATE_REVOKE_USER_RESET_PASSWORD_TOKEN_BY_USER_ID_PROC = `
CREATE OR REPLACE PROCEDURE revoke_user_reset_password_token_by_user_id(
    IN in_user_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the user_reset_password_tokens table
    UPDATE user_reset_password_tokens
    SET revoked_at = NOW()
    WHERE user_id = in_user_id
    AND revoked_at IS NULL
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
    -- Revoke the user reset password token
    call revoke_user_reset_password_token_by_user_id(in_user_id);
    
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
    -- Revoke the user password hash
    UPDATE user_password_hashes
    SET revoked_at = NOW()
    WHERE user_id = in_user_id
    AND revoked_at IS NULL;
    
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
    INTO var_user_reset_password_token_id
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

    -- Revoke the user reset password token
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
    AND user_usernames.revoked_at IS NULL
    AND user_password_hashes.revoked_at IS NULL
    AND user_emails.revoked_at IS NULL
    AND user_email_verification_tokens.revoked_at IS NULL;
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
    AND revoked_at IS NULL;
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
    AND deleted_at IS NULL;
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
    AND deleted_at IS NULL;
END;
$$;
`

// Create a stored procedure that assigns a profile to a user
export const CREATE_ASSIGN_USER_PROFILE_PROC = `
CREATE OR REPLACE PROCEDURE assign_user_profile(
    IN in_assigned_by_user_id BIGINT,
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
        assigned_by_user_id
    )
    VALUES (
        out_user_id,
        in_profile_id,
        in_assigned_by_user_id
    );
END;
$$;
`

// Create a stored procedure that revokes a profile from a user
export const CREATE_REVOKE_USER_PROFILE_PROC = `
CREATE OR REPLACE PROCEDURE revoke_user_profile(
    IN in_revoked_by_user_id BIGINT,
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
    SET revoked_at = NOW(),
        revoked_by_user_id = in_revoked_by_user_id
    WHERE user_id = out_user_id
    AND profile_id = in_profile_id
    AND revoked_at IS NULL;
END;
$$;
`

// Create a stored procedure that assigns a permission to a profile
export const CREATE_ASSIGN_PROFILE_PERMISSION_PROC = `
CREATE OR REPLACE PROCEDURE assign_profile_permission(
    IN in_assigned_by_user_id BIGINT,
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

    -- Insert into permissions table
    INSERT INTO permissions (
        profile_id,
        method_id,
        assigned_by_user_id
    )
    VALUES (
        in_profile_id,
        in_method_id,
        in_assigned_by_user_id
    )
    RETURNING id INTO out_permission_id;
END;
$$;
`

// Create a stored procedure that revokes a permission from a profile
export const CREATE_REVOKE_PROFILE_PERMISSION_PROC = `
CREATE OR REPLACE PROCEDURE revoke_profile_permission(
    IN in_revoked_by_user_id BIGINT,
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
    
    -- Update the permissions table
    UPDATE permissions
    SET revoked_at = NOW(),
        revoked_by_user_id = in_revoked_by_user_id
    WHERE profile_id = in_profile_id
    AND method_id = in_method_id
    AND revoked_at IS NULL
    RETURNING id INTO out_permission_id;
END;
$$;
`

// Create a stored procedure that creates a new profile
export const CREATE_CREATE_PROFILE_PROC = `
CREATE OR REPLACE PROCEDURE create_profile(
    IN in_created_by_user_id BIGINT,
    IN in_profile_name VARCHAR,
    IN in_profile_description VARCHAR,
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
    IN in_profile_description VARCHAR,
    OUT out_is_profile_id_valid BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_current_profile_name VARCHAR;
    var_current_profile_description VARCHAR;
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
    AND deleted_at IS NULL;

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

// Create a stored procedure that deletes a profile
export const CREATE_DELETE_PROFILE_PROC = `
CREATE OR REPLACE PROCEDURE delete_profile(
    IN in_deleted_by_user_id BIGINT,
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
    SET deleted_at = NOW(),
        deleted_by_user_id = in_deleted_by_user_id
    WHERE id = in_profile_id
    AND deleted_at IS NULL;
    
    -- Update the permissions table
    UPDATE permissions
    SET revoked_at = NOW(),
        revoked_by_user_id = in_deleted_by_user_id
    WHERE profile_id = in_profile_id
    AND revoked_at IS NULL;
    
    -- Update the user_profiles table
    UPDATE user_profiles
    SET revoked_at = NOW(),
        revoked_by_user_id = in_deleted_by_user_id
    WHERE profile_id = in_profile_id
    AND revoked_at IS NULL;
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
            assigned_by_user_id
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

// Create a stored procedure that deletes all modules
export const CREATE_DELETE_ALL_MODULES_PROC = `
CREATE OR REPLACE PROCEDURE delete_all_modules(
    IN in_deleted_by_user_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the modules table
    UPDATE modules
    SET deleted_at = NOW(),
        deleted_by_user_id = in_deleted_by_user_id
    WHERE deleted_at IS NULL;
    
    -- Update the objects table
    UPDATE objects
    SET deleted_at = NOW(),
        deleted_by_user_id = in_deleted_by_user_id
    WHERE deleted_at IS NULL;
    
    -- Update the methods table
    UPDATE methods
    SET deleted_at = NOW(),
        deleted_by_user_id = in_deleted_by_user_id
    WHERE deleted_at IS NULL;
    
    -- Update the permissions table
    UPDATE permissions
    SET revoked_at = NOW(),
        revoked_by_user_id = in_deleted_by_user_id
    WHERE revoked_at IS NULL;
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
    AND deleted_at IS NULL;
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
    AND deleted_at IS NULL;
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
    AND deleted_at IS NULL;
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
    -- Revoke the current username
    UPDATE user_usernames
    SET revoked_at = NOW()
    WHERE user_id = in_user_id
    AND revoked_at IS NULL;
    
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
    FROM users
    INNER JOIN people ON people.id = users.person_id
    WHERE users.id = in_user_id; 
    
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
    IN in_document_pages BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into documents table
    INSERT INTO documents (
        registered_by_user_id,
        title,
        description,
        release_date,
        pages
    )
    VALUES (
        in_registered_by_user_id,
        in_document_title,
        in_document_description,
        in_document_release_date,
        in_document_pages
    );
END;
$$;
`

// Create a stored procedure that updates a document
export const CREATE_UPDATE_DOCUMENT_PROC = `
CREATE OR REPLACE PROCEDURE update_document(
    IN in_document_id BIGINT,
    IN in_document_title VARCHAR,
    IN in_document_description TEXT,
    IN in_document_release_date DATE,
    IN in_document_pages BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    var_current_document_title VARCHAR;
    var_current_document_description TEXT;
    var_current_document_release_date DATE;
    var_current_document_pages BIGINT;
BEGIN
    -- Get the current document title, description, release date and pages
    SELECT title, description, release_date, pages
    INTO var_current_document_title, var_current_document_description, var_current_document_release_date, var_current_document_pages
    FROM documents
    WHERE id = in_document_id
    AND deleted_at IS NULL;

    -- Update the documents table
    UPDATE documents
    SET title = COALESCE(var_document_title, title),
        description = COALESCE(var_document_description, description),
        release_date = COALESCE(var_document_release_date, release_date),
        pages = COALESCE(var_document_pages, pages)
    WHERE id = in_document_id
    AND deleted_at IS NULL;
END;
$$;
`

// Create a stored procedure that deletes a document
export const CREATE_DELETE_DOCUMENT_PROC = `
CREATE OR REPLACE PROCEDURE delete_document(
    IN in_deleted_by_user_id BIGINT,
    IN in_document_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the documents table
    UPDATE documents
    SET deleted_at = NOW(),
        deleted_by_user_id = in_deleted_by_user_id
    WHERE id = in_document_id
    AND deleted_at IS NULL;
END;
$$;
`

// Create a stored procedure that creates a new document image
export const CREATE_CREATE_DOCUMENT_IMAGE_PROC = `
CREATE OR REPLACE PROCEDURE create_document_image(
    IN in_created_by_user_id BIGINT,
    IN in_document_id BIGINT,
    IN in_document_image_url VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into document_images table
    INSERT INTO document_images (
        created_by_user_id,
        document_id,
        image_url
    )
    VALUES (
        in_created_by_user_id,
        in_document_id,
        in_document_image_url
    );
END;
$$;
`

// Create a stored procedure that deletes a document image
export const CREATE_DELETE_DOCUMENT_IMAGE_PROC = `
CREATE OR REPLACE PROCEDURE delete_document_image(
    IN in_deleted_by_user_id BIGINT,
    IN in_document_image_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the document_images table
    UPDATE document_images
    SET deleted_at = NOW(),
        deleted_by_user_id = in_deleted_by_user_id
    WHERE id = in_document_image_id
    AND deleted_at IS NULL;
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
BEGIN
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

// Create a stored procedure that deletes a document language
export const CREATE_DELETE_DOCUMENT_LANGUAGE_PROC = `
CREATE OR REPLACE PROCEDURE delete_document_language(
    IN in_deleted_by_user_id BIGINT,
    IN in_document_id BIGINT,
    IN in_language_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the document_languages table
    UPDATE document_languages
    SET deleted_at = NOW(),
        deleted_by_user_id = in_deleted_by_user_id
    WHERE document_id = in_document_id
    AND language_id = in_language_id
    AND deleted_at IS NULL;
END;
$$;
`

// Create a stored procedure that creates a new post
export const CREATE_CREATE_POST_PROC = `
CREATE OR REPLACE PROCEDURE create_post(
    IN in_created_by_user_id BIGINT,
    IN in_document_id BIGINT,
    IN in_post_available_until TIMESTAMP,
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
    AND deleted_at IS NULL;
END;
$$;
`

// Create a stored procedure that deletes a post
export const CREATE_DELETE_POST_PROC = `
CREATE OR REPLACE PROCEDURE delete_post(
    IN in_deleted_by_user_id BIGINT,
    IN in_post_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the posts table
    UPDATE posts
    SET deleted_at = NOW(),
        deleted_by_user_id = in_deleted_by_user_id
    WHERE id = in_post_id
    AND deleted_at IS NULL;
END;
$$;
`