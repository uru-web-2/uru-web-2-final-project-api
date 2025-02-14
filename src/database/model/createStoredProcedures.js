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
	
	-- Insert into profiles table
	INSERT INTO profiles (
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
    IN in_profile_id VARCHAR,
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
    
    -- Insert into profiles table
    INSERT INTO profiles (
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
    IN in_profile_id VARCHAR,
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

    -- Update the profiles table
    UPDATE profiles
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
    OUT out_profile_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into profiles table
    INSERT INTO profiles (
        created_by_user_id,
        name
    )
    VALUES (
        in_created_by_user_id,
        in_profile_name
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
    SET name = in_profile_name,
        updated_by_user_id = in_updated_by_user_id
    WHERE id = in_profile_id
    AND deleted_at IS NULL;
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
    out_profile_id BIGINT;
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
    FOREACH out_profile_id IN ARRAY in_profile_ids
    LOOP
        INSERT INTO permissions (
            profile_id,
            method_id,
            assigned_by_user_id
        )
        VALUES (
            out_profile_id,
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