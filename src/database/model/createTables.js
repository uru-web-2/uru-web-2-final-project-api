// Query to create the users table
export const CREATE_USERS = `
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birthdate DATE NOT NULL,
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);
`

// Query to create the user_usernames table
export const CREATE_USER_USERNAMES = `
CREATE TABLE IF NOT EXISTS user_usernames (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    username VARCHAR(50) NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
`

// Query to create the user_password_hashes table
export const CREATE_USER_PASSWORD_HASHES = `
CREATE TABLE IF NOT EXISTS user_password_hashes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
`

// Query to create the user_emails table
export const CREATE_USER_EMAILS = `
CREATE TABLE IF NOT EXISTS user_emails (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    verification_id BIGINT NOT NULL,
    email VARCHAR(255) NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (verification_id) REFERENCES user_email_verifications(id)
);
`

// Query to create the user_email_verifications table
export const CREATE_USER_EMAIL_VERIFICATIONS = `
CREATE TABLE IF NOT EXISTS user_email_verifications (
    id BIGSERIAL PRIMARY KEY,
    user_email_id BIGINT NOT NULL,
    verification_token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    verified_at TIMESTAMP,
    revoked_at TIMESTAMP,
    FOREIGN KEY (user_email_id) REFERENCES user_emails(id)
);
`

// Query to create the modules table
export const CREATE_MODULES = `
CREATE TABLE IF NOT EXISTS modules (
    id BIGSERIAL PRIMARY KEY,
    parent_module_id BIGINT,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY (parent_module_id) REFERENCES modules(id),
    UNIQUE(parent_module_id, name)
);
`

// Query to create the objects table
export const CREATE_OBJECTS = `
CREATE TABLE IF NOT EXISTS objects (
    id BIGSERIAL PRIMARY KEY,
    module_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id)
);
`

// Query to create the methods table
export const CREATE_METHODS = `
CREATE TABLE IF NOT EXISTS methods (
    id BIGSERIAL PRIMARY KEY,
    object_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY (object_id) REFERENCES objects(id)
);
`

// Query to create the profiles table
export const CREATE_PROFILES = `
CREATE TABLE IF NOT EXISTS profiles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
`

// Query to create the permissions table
export const CREATE_PERMISSIONS = `
CREATE TABLE IF NOT EXISTS permissions (
    id BIGSERIAL PRIMARY KEY,
    method_id BIGINT NOT NULL,
    profile_id BIGINT NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMP,
    FOREIGN KEY (method_id) REFERENCES methods(id),
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
);
`

// Query to create the user_profiles table
export const CREATE_USER_PROFILES = `
CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    profile_id BIGINT NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
);
`

