import {
    BOOK_COPIES_UNIQUE_UUID,
    BOOK_MODELS_UNIQUE_BOOK_ID_LANGUAGE_ID,
    BOOKS_UNIQUE_ISBN,
    COUNTRIES_UNIQUE_NAME,
    DOCUMENT_AUTHORS_UNIQUE_DOCUMENT_ID_AUTHOR_ID,
    DOCUMENT_TOPICS_UNIQUE_DOCUMENT_ID_TOPIC_ID,
    IDENTITY_DOCUMENTS_UNIQUE_NUMBER,
    LANGUAGES_UNIQUE_NAME,
    LOCATIONS_UNIQUE_FLOOR_SECTION,
    METHODS_UNIQUE_OBJECT_ID_NAME,
    MODULES_UNIQUE_NAME,
    MODULES_UNIQUE_PARENT_MODULE_ID_NAME,
    OBJECTS_UNIQUE_MODULE_ID_NAME,
    PASSPORTS_UNIQUE_NUMBER,
    PEOPLE_UNIQUE_IDENTITY_DOCUMENT,
    PEOPLE_UNIQUE_PASSPORT,
    PERMISSIONS_UNIQUE_METHOD_ID_PROFILE_ID,
    PROFILES_UNIQUE_NAME,
    PUBLISHERS_UNIQUE_NAME,
    USER_EMAIL_VERIFICATIONS_UNIQUE_USER_EMAIL_ID,
    USER_EMAILS_UNIQUE_EMAIL,
    USER_EMAILS_UNIQUE_USER_ID,
    USER_PASSWORD_HASHES_UNIQUE_USER_ID,
    USER_PROFILES_UNIQUE_USER_ID_PROFILE_ID,
    USER_USERNAMES_UNIQUE_USER_ID,
    USER_USERNAMES_UNIQUE_USERNAME,
    USERS_UNIQUE_PERSON
} from "./constraints.js";

// Query to create the countries table
export const CREATE_COUNTRIES = `
CREATE TABLE IF NOT EXISTS countries (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS ${COUNTRIES_UNIQUE_NAME} ON countries (name);
`;

// Query to create the passports table
export const CREATE_PASSPORTS = `
CREATE TABLE IF NOT EXISTS passports (
    id BIGSERIAL PRIMARY KEY,
    passport_number VARCHAR(50) NOT NULL,
    country_id BIGINT NOT NULL,
    deleted_at TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ${PASSPORTS_UNIQUE_NUMBER} ON passports (country_id, passport_number) WHERE deleted_at IS NULL;
`;

// Query to create the identity_documents table
export const CREATE_IDENTITY_DOCUMENTS = `
CREATE TABLE IF NOT EXISTS identity_documents (
    id BIGSERIAL PRIMARY KEY,
    identity_document_number VARCHAR(40) NOT NULL,
    country_id BIGINT NOT NULL,
    deleted_at TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ${IDENTITY_DOCUMENTS_UNIQUE_NUMBER} ON identity_documents (country_id, identity_document_number) WHERE deleted_at IS NULL;
`;

// Query to create the people table
export const CREATE_PEOPLE = `
CREATE TABLE IF NOT EXISTS people (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birthdate DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    identity_document_id BIGINT,
    passport_id BIGINT,
    deleted_at TIMESTAMP,
    FOREIGN KEY (identity_document_id) REFERENCES identity_documents(id),
    FOREIGN KEY (passport_id) REFERENCES passports(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ${PEOPLE_UNIQUE_IDENTITY_DOCUMENT} ON people (id, identity_document_id) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ${PEOPLE_UNIQUE_PASSPORT} ON people (id, passport_id) WHERE deleted_at IS NULL;
`;

// Query to create the users table
export const CREATE_USERS = `
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    person_id BIGINT NOT NULL,
    FOREIGN KEY (person_id) REFERENCES people(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ${USERS_UNIQUE_PERSON} ON users (person_id);
`

// Query to create the person_positions table
export const CREATE_PERSON_POSITIONS = `
CREATE TABLE IF NOT EXISTS person_positions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    person_id BIGINT NOT NULL,
    assigned_by_user_id BIGINT NOT NULL,
    revoked_by_user_id BIGINT,
    assigned_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES people(id),
    FOREIGN KEY (assigned_by_user_id) REFERENCES users(id),
    FOREIGN KEY (revoked_by_user_id) REFERENCES users(id)
);
`;

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
CREATE UNIQUE INDEX IF NOT EXISTS ${USER_USERNAMES_UNIQUE_USERNAME} ON user_usernames (username) WHERE revoked_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ${USER_USERNAMES_UNIQUE_USER_ID} ON user_usernames (user_id) WHERE revoked_at IS NULL;
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
CREATE UNIQUE INDEX IF NOT EXISTS ${USER_PASSWORD_HASHES_UNIQUE_USER_ID} ON user_password_hashes (user_id) WHERE revoked_at IS NULL;
`

// Query to create the user_emails table
export const CREATE_USER_EMAILS = `
CREATE TABLE IF NOT EXISTS user_emails (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    email VARCHAR(255) NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ${USER_EMAILS_UNIQUE_EMAIL} ON user_emails (email) WHERE revoked_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ${USER_EMAILS_UNIQUE_USER_ID} ON user_emails (user_id) WHERE revoked_at IS NULL;
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
CREATE UNIQUE INDEX IF NOT EXISTS ${USER_EMAIL_VERIFICATIONS_UNIQUE_USER_EMAIL_ID} ON user_email_verifications (user_email_id) WHERE revoked_at IS NULL;
`

// Query to create the modules table
export const CREATE_MODULES = `
CREATE TABLE IF NOT EXISTS modules (
    id BIGSERIAL PRIMARY KEY,
    parent_module_id BIGINT,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    created_by_user_id BIGINT,
    deleted_by_user_id BIGINT,
    FOREIGN KEY (parent_module_id) REFERENCES modules(id),
    FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    FOREIGN KEY (deleted_by_user_id) REFERENCES users(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ${MODULES_UNIQUE_PARENT_MODULE_ID_NAME} ON modules (parent_module_id, name) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ${MODULES_UNIQUE_NAME} ON modules (name) WHERE deleted_at IS NULL AND parent_module_id IS NULL;
`

// Query to create the objects table
export const CREATE_OBJECTS = `
CREATE TABLE IF NOT EXISTS objects (
    id BIGSERIAL PRIMARY KEY,
    module_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    created_by_user_id BIGINT,
    deleted_by_user_id BIGINT,
    FOREIGN KEY (module_id) REFERENCES modules(id),
    FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    FOREIGN KEY (deleted_by_user_id) REFERENCES users(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ${OBJECTS_UNIQUE_MODULE_ID_NAME} ON objects (module_id, name) WHERE deleted_at IS NULL;
`

// Query to create the methods table
export const CREATE_METHODS = `
CREATE TABLE IF NOT EXISTS methods (
    id BIGSERIAL PRIMARY KEY,
    object_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    created_by_user_id BIGINT,
    deleted_by_user_id BIGINT,
    FOREIGN KEY (object_id) REFERENCES objects(id),
    FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    FOREIGN KEY (deleted_by_user_id) REFERENCES users(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ${METHODS_UNIQUE_OBJECT_ID_NAME} ON methods (object_id, name) WHERE deleted_at IS NULL;
`

// Query to create the profiles table
export const CREATE_PROFILES = `
CREATE TABLE IF NOT EXISTS profiles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by_user_id BIGINT,
    updated_by_user_id BIGINT,
    deleted_by_user_id BIGINT,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    FOREIGN KEY (updated_by_user_id) REFERENCES users(id),
    FOREIGN KEY (deleted_by_user_id) REFERENCES users(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ${PROFILES_UNIQUE_NAME} ON profiles (name) WHERE deleted_at IS NULL;
`

// Query to create the permissions table
export const CREATE_PERMISSIONS = `
CREATE TABLE IF NOT EXISTS permissions (
    id BIGSERIAL PRIMARY KEY,
    method_id BIGINT NOT NULL,
    profile_id BIGINT NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMP,
    assigned_by_user_id BIGINT,
    revoked_by_user_id BIGINT,
    FOREIGN KEY (method_id) REFERENCES methods(id),
    FOREIGN KEY (profile_id) REFERENCES profiles(id),
    FOREIGN KEY (assigned_by_user_id) REFERENCES users(id),
    FOREIGN KEY (revoked_by_user_id) REFERENCES users(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ${PERMISSIONS_UNIQUE_METHOD_ID_PROFILE_ID} ON permissions (method_id, profile_id) WHERE revoked_at IS NULL;
`

// Query to create the user_profiles table
export const CREATE_USER_PROFILES = `
CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    profile_id BIGINT NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMP,
    assigned_by_user_id BIGINT,
    revoked_by_user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (profile_id) REFERENCES profiles(id),
    FOREIGN KEY (assigned_by_user_id) REFERENCES users(id),
    FOREIGN KEY (revoked_by_user_id) REFERENCES users(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ${USER_PROFILES_UNIQUE_USER_ID_PROFILE_ID} ON user_profiles (user_id, profile_id) WHERE revoked_at IS NULL;
`
// Query to create the documents table
export const CREATE_DOCUMENTS = `
CREATE TABLE IF NOT EXISTS documents (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(36),
    registered_at TIMESTAMP NOT NULL DEFAULT NOW(),
    release_date TIMESTAMP,
    metadata TEXT,
    average_ratings FLOAT DEFAULT 0,
    number_ratings BIGINT DEFAULT 0,
    pages INTEGER
);
`;

// Query to create the document_images table
export const CREATE_DOCUMENT_IMAGES = `
CREATE TABLE IF NOT EXISTS document_images (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    removed_at TIMESTAMP,
    created_by_user_id BIGINT NOT NULL,
    removed_by_user_id BIGINT,
    FOREIGN KEY (document_id) REFERENCES documents(id),
    FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    FOREIGN KEY (removed_by_user_id) REFERENCES users(id)
);
`;

// Query to create the posts table
export const CREATE_POSTS = `
CREATE TABLE IF NOT EXISTS posts (
    id BIGSERIAL PRIMARY KEY,
    available_since TIMESTAMP NOT NULL DEFAULT NOW(),
    available_until TIMESTAMP,
    removed_at TIMESTAMP,
    document_id BIGINT NOT NULL,
    created_by_user_id BIGINT NOT NULL,
    removed_by_user_id BIGINT,
    FOREIGN KEY (document_id) REFERENCES documents(id),
    FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    FOREIGN KEY (removed_by_user_id) REFERENCES users(id)
);
`;

// Query to create the locations table
export const CREATE_LOCATIONS = `
CREATE TABLE IF NOT EXISTS locations (
    id BIGSERIAL PRIMARY KEY,
    floor INTEGER NOT NULL,
    area VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    removed_at TIMESTAMP,
    created_by_user_id BIGINT NOT NULL,
    removed_by_user_id BIGINT,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    FOREIGN KEY (removed_by_user_id) REFERENCES users(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ${LOCATIONS_UNIQUE_FLOOR_SECTION} ON locations (floor, section);
`;

// Query to create the location_sections table
export const CREATE_LOCATION_SECTIONS = `
CREATE TABLE IF NOT EXISTS location_sections (
    id BIGSERIAL PRIMARY KEY,
    location_id BIGINT NOT NULL,
    section VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    removed_at TIMESTAMP,
    created_by_user_id BIGINT NOT NULL,
    removed_by_user_id BIGINT,
    FOREIGN KEY (location_id) REFERENCES locations(id),
    FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    FOREIGN KEY (removed_by_user_id) REFERENCES users(id)
);
`;

// Query to create the document_authors table
export const CREATE_DOCUMENT_AUTHORS = `
CREATE TABLE IF NOT EXISTS document_authors (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL,
    document_id BIGINT NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    assigned_by_user_id BIGINT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES people(id),
    FOREIGN KEY (document_id) REFERENCES documents(id),
    FOREIGN KEY (assigned_by_user_id) REFERENCES users(id)      
);
CREATE UNIQUE INDEX IF NOT EXISTS ${DOCUMENT_AUTHORS_UNIQUE_DOCUMENT_ID_AUTHOR_ID} ON document_authors (author_id, document_id);
`;

// Query to create the document_locations table
export const CREATE_DOCUMENT_LOCATIONS = `
CREATE TABLE IF NOT EXISTS document_locations (
    id BIGSERIAL PRIMARY KEY,
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    removed_at TIMESTAMP,
    document_id BIGINT NOT NULL,
    location_section_id BIGINT NOT NULL,
    assigned_by_user_id BIGINT NOT NULL,
    removed_by_user_id BIGINT,
    FOREIGN KEY (document_id) REFERENCES documents(id),
    FOREIGN KEY (location_section_id) REFERENCES location_section_id(id),
    FOREIGN KEY (assigned_by_user_id) REFERENCES users(id),
    FOREIGN KEY (removed_by_user_id) REFERENCES users(id)
);
`;

// Query to create the document_reviews table
export const CREATE_DOCUMENT_REVIEWS = `
CREATE TABLE IF NOT EXISTS document_reviews (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    rating DOUBLE PRECISION NOT NULL,
    content VARCHAR(100),
    document_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (document_id) REFERENCES documents(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
`;

// Query to create the topics table
export const CREATE_TOPICS = `
CREATE TABLE IF NOT EXISTS topics (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    removed_at TIMESTAMP,
    created_by_user_id BIGINT NOT NULL,
    removed_by_user_id BIGINT,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    FOREIGN KEY (removed_by_user_id) REFERENCES users(id)
);
`;

// Query to create the document_topics table
export const CREATE_DOCUMENT_TOPICS = `
CREATE TABLE IF NOT EXISTS document_topics (
    id BIGSERIAL PRIMARY KEY,
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    removed_at TIMESTAMP,
    document_id BIGINT NOT NULL,
    topic_id BIGINT NOT NULL,
    assigned_by_user_id BIGINT NOT NULL,
    removed_by_user_id BIGINT,
    FOREIGN KEY (document_id) REFERENCES documents(id),
    FOREIGN KEY (topic_id) REFERENCES topics(id),
    FOREIGN KEY (assigned_by_user_id) REFERENCES users(id),
    FOREIGN KEY (removed_by_user_id) REFERENCES users(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ${DOCUMENT_TOPICS_UNIQUE_DOCUMENT_ID_TOPIC_ID} ON document_topics (document_id, topic_id);
`;

// Query to create the publishers table
export const CREATE_PUBLISHERS = `
CREATE TABLE IF NOT EXISTS publishers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    removed_at TIMESTAMP,
    created_by_user_id BIGINT NOT NULL,
    removed_by_user_id BIGINT,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    FOREIGN KEY (removed_by_user_id) REFERENCES users(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ${PUBLISHERS_UNIQUE_NAME} ON publishers (name) WHERE removed_at IS NULL;
`;

// Query to create the books table
export const CREATE_BOOKS = `
CREATE TABLE IF NOT EXISTS books (
    id BIGSERIAL PRIMARY KEY,
    isbn VARCHAR(150) NOT NULL,
    title VARCHAR(100),
    publisher_id BIGSERIAL NOT NULL,
    FOREIGN KEY (publisher_id) REFERENCES publishers(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ${BOOKS_UNIQUE_ISBN} ON books (isbn);
`;

// Query to create the languages table
export const CREATE_LANGUAGES = `
CREATE TABLE IF NOT EXISTS languages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    removed_at TIMESTAMP,
    created_by_user_id BIGINT NOT NULL,
    removed_by_user_id BIGINT,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    FOREIGN KEY (removed_by_user_id) REFERENCES users(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ${LANGUAGES_UNIQUE_NAME} ON languages (name);
`

// Query to create the document_languages table
export const CREATE_DOCUMENT_LANGUAGES = `
CREATE TABLE IF NOT EXISTS document_languages (
    id BIGSERIAL PRIMARY KEY,
    language_id BIGINT NOT NULL,
    document_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    removed_at TIMESTAMP,
    created_by_user_id BIGINT NOT NULL,
    removed_by_user_id BIGINT,
    FOREIGN KEY (language_id) REFERENCES languages(id),
    FOREIGN KEY (document_id) REFERENCES documents(id),
    FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    FOREIGN KEY (removed_by_user_id) REFERENCES users(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ${BOOK_MODELS_UNIQUE_BOOK_ID_LANGUAGE_ID} ON document_languages (book_id, language_id);
`;

// Query to create the book_versions table
export const CREATE_BOOK_VERSIONS = `
CREATE TABLE IF NOT EXISTS book_versions (
    id BIGSERIAL PRIMARY KEY,
    book_id BIGSERIAL NOT NULL,
    version VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    removed_at TIMESTAMP,
    created_by_user_id BIGINT NOT NULL,
    removed_by_user_id BIGINT,
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    FOREIGN KEY (removed_by_user_id) REFERENCES users(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ${BOOK_MODELS_UNIQUE_BOOK_ID_LANGUAGE_ID} ON book_versions (book_id, language_id);
`;

// Query to create the book_copies table
export const CREATE_BOOK_COPIES = `
CREATE TABLE IF NOT EXISTS book_copies (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(200),
    book_version_id BIGSERIAL NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    removed_at TIMESTAMP,
    created_by_user_id BIGINT NOT NULL,
    removed_by_user_id BIGINT,
    FOREIGN KEY (book_version_id) REFERENCES book_versions(id),
    FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    FOREIGN KEY (removed_by_user_id) REFERENCES users(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ${BOOK_COPIES_UNIQUE_UUID} ON book_copies (uuid);
`;


// Query to create the book_model_loans table
export const CREATE_BOOK_MODEL_LOANS = `
CREATE TABLE IF NOT EXISTS book_model_loans (
    id BIGSERIAL PRIMARY KEY,
    reserved_at TIMESTAMP NOT NULL DEFAULT NOW(),
    reserved_until TIMESTAMP NOT NULL,
    loaned_at TIMESTAMP,
    must_return_before TIMESTAMP,
    returned_at TIMESTAMP,
    loaned_by_user_id BIGINT NOT NULL,
    loaned_to_user_id BIGINT NOT NULL,
    removed_by_user_id BIGINT,
    removed_at TIMESTAMP,
    book_version_id BIGINT NOT NULL,
    book_copy_id BIGINT,
    FOREIGN KEY (loaned_by_user_id) REFERENCES users(id),
    FOREIGN KEY (loaned_to_user_id) REFERENCES users(id),
    FOREIGN KEY (book_version_id) REFERENCES book_versions(id),
    FOREIGN KEY (book_copy_id) REFERENCES book_copies(id)
);
`;

// Query to create the works table
export const CREATE_WORKS = `
CREATE TABLE IF NOT EXISTS works (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(100),
    document_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    removed_at TIMESTAMP,
    created_by_user_id BIGINT NOT NULL,
    removed_by_user_id BIGINT,
    FOREIGN KEY (document_id) REFERENCES documents(id),
    FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    FOREIGN KEY (removed_by_user_id) REFERENCES users(id)
);
`;

// Query to create the articles table
export const CREATE_ARTICLES = `
CREATE TABLE IF NOT EXISTS articles (
    id BIGSERIAL PRIMARY KEY,
    work_id BIGSERIAL NOT NULL,
    FOREIGN KEY (work_id) REFERENCES works(id)
);
`;

// Query to create the article_jury_members table
export const CREATE_ARTICLE_JURY_MEMBERS = `
CREATE TABLE IF NOT EXISTS article_jury_members (
    id BIGSERIAL PRIMARY KEY,
    assigned_at TIMESTAMP,
    removed_at TIMESTAMP,
    jury_member_id BIGSERIAL NOT NULL,
    article_id BIGSERIAL NOT NULL,
    assigned_by_user_id BIGINT NOT NULL,
    removed_by_user_id BIGINT,
    FOREIGN KEY (jury_member_id) REFERENCES people(id),
    FOREIGN KEY (article_id) REFERENCES articles(id),
    FOREIGN KEY (assigned_by_user_id) REFERENCES users(id),
    FOREIGN KEY (removed_by_user_id) REFERENCES users(id)
);
`;

// Query to create the article_annotations table
export const CREATE_ARTICLE_ANNOTATIONS = `
CREATE TABLE IF NOT EXISTS article_annotations (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(100),
    content TEXT,
    created_at TIMESTAMP,
    resolved_at TIMESTAMP,
    created_by_jury_id BIGINT NOT NULL,
    resolved_by_jury_id BIGINT,
    FOREIGN KEY (created_by_jury_id) REFERENCES article_jury_members(id),
    FOREIGN KEY (resolved_by_jury_id) REFERENCES article_jury_members(id)
);
`;

// Query to create the magazines table
export const CREATE_MAGAZINES = `
CREATE TABLE IF NOT EXISTS magazines (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100)
);
`;

// Query to create the magazine_issues table
export const CREATE_MAGAZINE_ISSUES = `
CREATE TABLE IF NOT EXISTS magazine_issues (
    id BIGSERIAL PRIMARY KEY,
    issue_number INTEGER,
    magazine_id BIGSERIAL NOT NULL,
    FOREIGN KEY (magazine_id) REFERENCES magazines(id)    
);
`;

// Query to create the theses table
export const CREATE_THESES = `
CREATE TABLE IF NOT EXISTS theses (
    id BIGSERIAL PRIMARY KEY,
    work_id BIGSERIAL NOT NULL,
    FOREIGN KEY (work_id) REFERENCES works(id)
);
`;