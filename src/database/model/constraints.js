// Unique username constraint for the user_usernames table
export const USER_USERNAMES_UNIQUE_USERNAME = 'user_usernames_unique_username';

// Unique user ID constraint for the user_usernames table
export const USER_USERNAMES_UNIQUE_USER_ID = 'user_usernames_unique_user_id';

// Unique email constraint for the user_emails table
export const USER_EMAILS_UNIQUE_EMAIL = 'user_emails_unique_email';

// Unique user ID constraint for the user_emails table
export const USER_EMAILS_UNIQUE_USER_ID = 'user_emails_unique_user_id';

// Unique user email ID constraint for the user_email_verifications table
export const USER_EMAIL_VERIFICATIONS_UNIQUE_USER_EMAIL_ID = 'user_email_verifications_unique_user_email_id';

// Unique user ID constraint for the user_reset_password_tokens table
export const USER_RESET_PASSWORD_TOKENS_UNIQUE_USER_ID = 'user_reset_password_tokens_unique_user_id';

// Unique parent module ID and name constraint for the modules table
export const MODULES_UNIQUE_PARENT_MODULE_ID_NAME = 'modules_unique_parent_module_id_name';

// Unique name constraint for the modules table
export const MODULES_UNIQUE_NAME = 'modules_unique_name';

// Unique module ID and name constraint for the objects table
export const OBJECTS_UNIQUE_MODULE_ID_NAME = 'objects_unique_module_id_name';

// Unique object ID and name constraint for the methods table
export const METHODS_UNIQUE_OBJECT_ID_NAME = 'methods_unique_object_id_name';

// Unique method ID and profile ID constraint for the permissions table
export const PERMISSIONS_UNIQUE_METHOD_ID_PROFILE_ID = 'permissions_unique_method_id_profile_id';

// Unique profile name for the profiles table
export const PROFILES_UNIQUE_NAME = 'profiles_unique_name';

// Unique country name for the countries table
export const COUNTRIES_UNIQUE_NAME = 'countries_unique_name';

// Unique identity document number for the identity_documents table
export const IDENTITY_DOCUMENTS_UNIQUE_NUMBER = 'identity_documents_unique_number';

// Unique passport number for the passports table
export const PASSPORTS_UNIQUE_NUMBER = 'passports_unique_number';

// Unique identity document for the people table
export const PEOPLE_UNIQUE_IDENTITY_DOCUMENT = 'people_unique_identity_document';

// Unique passport for the people table
export const PEOPLE_UNIQUE_PASSPORT = 'people_unique_passport';

// Unique person for the users table
export const USERS_UNIQUE_PERSON = 'users_unique_person';

// Unique user ID and profile ID for the user_profiles table
export const USER_PROFILES_UNIQUE_USER_ID_PROFILE_ID = 'user_profiles_unique_user_id_profile_id';

// Unique user ID for the user_password_hashes table
export const USER_PASSWORD_HASHES_UNIQUE_USER_ID = 'user_password_hashes_unique_user_id';

// Unique floor area for the locations table
export const LOCATIONS_UNIQUE_FLOOR_AREA = 'locations_unique_floor_area';

// Unique document ID and author ID for the document_authors table
export const DOCUMENT_AUTHORS_UNIQUE_DOCUMENT_ID_AUTHOR_ID = 'document_authors_unique_document_id_author_id';

// Unique document ID and topic ID for the document_topics table
export const DOCUMENT_TOPICS_UNIQUE_DOCUMENT_ID_TOPIC_ID = 'document_topics_unique_document_id_topic_id';

// Unique publishers name for the publishers table
export const PUBLISHERS_UNIQUE_NAME = 'publishers_unique_name';

// Unique topic name for the topics table
export const TOPICS_UNIQUE_NAME = 'topics_unique_name';

// Unique ISBN for the books table
export const BOOKS_UNIQUE_ISBN = 'books_unique_isbn';

// Unique language name for the languages table
export const LANGUAGES_UNIQUE_NAME = 'languages_unique_name';

// Unique document ID and language ID for the document_languages table
export const DOCUMENT_LANGUAGES_UNIQUE_DOCUMENT_ID_LANGUAGE_ID = 'document_languages_unique_document_id_language_id';

// Unique UUID for the book_copies table
export const BOOK_COPIES_UNIQUE_UUID = 'book_copies_unique_uuid';

// Unique location ID and name for the location_sections table
export const LOCATION_SECTIONS_UNIQUE_LOCATION_ID_NAME = 'location_sections_unique_location_id_name';

// Created by user ID foreign key constraint for the identity_documents table
export const IDENTITY_DOCUMENTS_CREATED_BY_USER_ID_FK = 'identity_documents_created_by_user_id_fk';

// Deleted by user ID foreign key constraint for the identity_documents table
export const IDENTITY_DOCUMENTS_DELETED_BY_USER_ID_FK = 'identity_documents_deleted_by_user_id_fk';

// Created by user ID foreign key constraint for the passports table
export const PASSPORTS_CREATED_BY_USER_ID_FK = 'passports_created_by_user_id_fk';

// Deleted by user ID foreign key constraint for the passports table
export const PASSPORTS_DELETED_BY_USER_ID_FK = 'passports_deleted_by_user_id_fk';