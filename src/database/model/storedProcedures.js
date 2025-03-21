// Query to get a country ID by name
export const GET_COUNTRY_ID_BY_NAME_PROC = "CALL get_country_id_by_name($1, $2)"

// Query to create a new user personal document
export const CREATE_USER_PERSONAL_DOCUMENT_PROC = "CALL create_user_personal_document($1, $2, $3, $4, $5)"

// Query to delete a user personal document
export const DELETE_USER_PERSONAL_DOCUMENT_PROC = "CALL delete_user_personal_document($1, $2, $3)"

// Query to replace a user personal document
export const REPLACE_USER_PERSONAL_DOCUMENT_PROC = "CALL replace_user_personal_document($1, $2, $3, $4, $5)"

// Query to create a new person
export const CREATE_PERSON_PROC = "CALL create_person($1, $2, $3, $4, $5, $6, $7)"

// Query to create a new user email
export const CREATE_USER_EMAIL_PROC = "CALL create_user_email($1, $2, $3, $4, $5)"

// Query to update a user email
export const UPDATE_USER_EMAIL_PROC = "CALL update_user_email($1, $2, $3, $4, $5)"

// Query to revoke a user email verification token by user email ID
export const REVOKE_USER_EMAIL_VERIFICATION_TOKEN_BY_USER_EMAIL_ID_PROC = "CALL revoke_user_email_verification_token_by_user_email_id($1)"

// Query to create a new user email verification token
export const CREATE_USER_EMAIL_VERIFICATION_TOKEN_PROC = "CALL create_user_email_verification_token($1, $2, $3, $4)"

// Query to get the user email information by user ID
export const GET_USER_EMAIL_INFO_BY_USER_ID_PROC = "CALL get_user_email_info_by_user_id($1, $2, $3, $4, $5)"

// Query to get the user email information by user email
export const GET_USER_EMAIL_INFO_BY_USER_EMAIL_PROC = "CALL get_user_email_info_by_user_email($1, $2, $3, $4, $5)"

// Query to verify a user email verification token
export const VERIFY_USER_EMAIL_VERIFICATION_TOKEN_PROC = "CALL verify_user_email_verification_token($1, $2)"

// Query to revoke a user reset password token by user ID
export const REVOKE_USER_RESET_PASSWORD_TOKEN_BY_USER_ID_PROC = "CALL revoke_user_reset_password_token_by_user_id($1)"

// Query to update a user password
export const UPDATE_USER_PASSWORD_HASH_PROC = "CALL update_user_password_hash($1, $2)"

// Query to create a new user reset password token
export const CREATE_USER_RESET_PASSWORD_TOKEN_PROC = "CALL create_user_reset_password_token($1, $2, $3)"

// Query to reset a user password
export const RESET_USER_PASSWORD_PROC = "CALL reset_user_password($1, $2, $3)"

// Query to create a new user
export const CREATE_USER_PROC = "CALL create_user($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)"

// Query to log in a user
export const LOG_IN_PROC = "CALL log_in($1, $2, $3, $4)"

// Query to get the user ID by username
export const GET_USER_ID_BY_USERNAME_PROC = "CALL get_user_id_by_username($1, $2)"

// Query to assign a profile to a user
export const ASSIGN_USER_PROFILE_PROC = "CALL assign_user_profile($1, $2, $3, $4, $5)"

// Query to revoke a profile from a user
export const REVOKE_USER_PROFILE_PROC = "CALL revoke_user_profile($1, $2, $3, $4, $5)"

// Query to assign a permission to a profile
export const ASSIGN_PROFILE_PERMISSION_PROC = "CALL assign_profile_permission($1, $2, $3, $4, $5, $6)"

// Query to revoke a permission from a profile
export const REVOKE_PROFILE_PERMISSION_PROC = "CALL revoke_profile_permission($1, $2, $3, $4, $5, $6)"

// Query to create a profile
export const CREATE_PROFILE_PROC = "CALL create_profile($1, $2, $3)"

// Query to update a profile
export const UPDATE_PROFILE_PROC = "CALL update_profile($1, $2, $3, $4)"

// Query to delete a profile
export const DELETE_PROFILE_PROC = "CALL delete_profile($1, $2, $3)"

// Query to create a new module
export const CREATE_MODULE_PROC = "CALL create_module($1, $2, $3, $4)"

// Query to create a new object
export const CREATE_OBJECT_PROC = "CALL create_object($1, $2, $3, $4)"

// Query to create a new method
export const CREATE_METHOD_PROC = "CALL create_method($1, $2, $3, $4)"

// Query to delete all modules
export const DELETE_ALL_MODULES_PROC = "CALL delete_all_modules($1)"

// Query to create a new method with the profiles for the permissions
export const CREATE_METHOD_WITH_PROFILES_PROC = "CALL create_method_with_profiles($1, $2, $3, $4, $5)"

// Query to get the module ID by name
export const GET_MODULE_ID_BY_NAME_PROC = "CALL get_module_id_by_name($1, $2)"

// Query to get the object ID by name
export const GET_OBJECT_ID_BY_NAME_PROC = "CALL get_object_id_by_name($1, $2)"

// Query to get the method ID by name
export const GET_METHOD_ID_BY_NAME_PROC = "CALL get_method_id_by_name($1, $2)"

// Query to get the number of users
export const GET_NUMBER_OF_USERS_PROC = "CALL get_number_of_users($1)"

// Query to update a user username
export const UPDATE_USER_USERNAME_PROC = "CALL update_user_username($1, $2)"

// Query to update a user by admin
export const UPDATE_USER_BY_ADMIN_PROC = "CALL update_user_by_admin($1, $2, $3, $4, $5, $6, $7, $8, $9)"

// Query to create a new document
export const CREATE_DOCUMENT_PROC = "CALL create_document($1, $2, $3, $4, $5, $6)"

// Query to update a document
export const UPDATE_DOCUMENT_PROC = "CALL update_document($1, $2, $3, $4, $5)"

// Query to delete a document
export const DELETE_DOCUMENT_PROC = "CALL delete_document($1, $2)"

// Query to create a new document image
export const CREATE_DOCUMENT_IMAGE_PROC = "CALL create_document_image($1, $2, $3)"

// Query to delete a document image
export const DELETE_DOCUMENT_IMAGE_PROC = "CALL delete_document_image($1, $2)"

// Query to assign a new document language
export const ASSIGN_DOCUMENT_LANGUAGE_PROC = "CALL assign_document_language($1, $2, $3)"

// Query to revoke a document language
export const REVOKE_DOCUMENT_LANGUAGE_PROC = "CALL revoke_document_language($1, $2)"

// Query to create a new post
export const CREATE_POST_PROC = "CALL create_post($1, $2, $3)"

// Query to update a post
export const UPDATE_POST_PROC = "CALL update_post($1, $2)"

// Query to delete a post
export const DELETE_POST_PROC = "CALL delete_post($1, $2)"

// Query to create a new location
export const CREATE_LOCATION_PROC = "CALL create_location($1, $2, $3)"

// Query to update a location
export const UPDATE_LOCATION_PROC = "CALL update_location($1, $2, $3)"

// Query to delete a location
export const DELETE_LOCATION_PROC = "CALL delete_location($1, $2)"

// Query to assign an author to a document
export const ASSIGN_DOCUMENT_AUTHOR_PROC = "CALL assign_document_author($1, $2, $3)"

// Query to remove an author from a document
export const REMOVE_DOCUMENT_AUTHOR_PROC = "CALL remove_document_author($1, $2, $3)"

// Query to assign a location section to a document
export const ASSIGN_DOCUMENT_LOCATION_SECTION_PROC = "CALL assign_document_location_section($1, $2, $3)"

// Query to remove a location section from a document
export const REMOVE_DOCUMENT_LOCATION_SECTION_PROC = "CALL remove_document_location_section($1, $2, $3)"

// Query to create a new topic
export const CREATE_TOPIC_PROC = "CALL create_topic($1, $2, $3)"

// Query to update a topic
export const UPDATE_TOPIC_PROC = "CALL update_topic($1, $2, $3)"

// Query to delete a topic
export const DELETE_TOPIC_PROC = "CALL delete_topic($1, $2)"

// Query to assign a topic to a document
export const ASSIGN_DOCUMENT_TOPIC_PROC = "CALL assign_document_topic($1, $2, $3)"

// Query to remove a topic from a document
export const REMOVE_DOCUMENT_TOPIC_PROC = "CALL remove_document_topic($1, $2, $3)"

// Query to create a new magazine
export const CREATE_MAGAZINE_PROC = "CALL create_magazine($1, $2, $3, $4)"

// Query to update a magazine
export const UPDATE_MAGAZINE_PROC = "CALL update_magazine($1, $2, $3, $4)"

// Query to delete a magazine
export const DELETE_MAGAZINE_PROC = "CALL delete_magazine($1, $2)"

// Query to set the profile permissions
export const SET_PROFILE_PERMISSIONS_PROC = "CALL set_profile_permissions($1, $2, $3, $4)"

// Query to create a new publisher
export const CREATE_PUBLISHER_PROC = "CALL create_publisher($1, $2, $3)"

// Query to update a publisher
export const UPDATE_PUBLISHER_PROC = "CALL update_publisher($1, $2, $3)"

// Query to delete a publisher
export const DELETE_PUBLISHER_PROC = "CALL delete_publisher($1, $2)"

// Query to create a new document review
export const CREATE_DOCUMENT_REVIEW_PROC = "CALL create_document_review($1, $2, $3, $4, $5, $6)"

// Query to update a document review
export const UPDATE_DOCUMENT_REVIEW_PROC = "CALL update_document_review($1, $2, $3, $4)"

// Query to delete a document review
export const DELETE_DOCUMENT_REVIEW_PROC = "CALL delete_document_review($1, $2)"

// Query to get the document ID by book ID
export const GET_DOCUMENT_ID_BY_BOOK_ID_PROC = "CALL get_document_id_by_book_id($1, $2)"

// Query to create a new book
export const CREATE_BOOK_PROC = "CALL create_book($1, $2, $3, $4, $5, $6, $7)"

// Query to update a book
export const UPDATE_BOOK_PROC = "CALL update_book($1, $2, $3, $4, $5, $6, $7)"

// Query to create a new work
export const CREATE_WORK_PROC = "CALL create_work($1, $2, $3, $4, $5, $6)"

// Query to get a document ID by work ID
export const GET_DOCUMENT_ID_BY_WORK_ID_PROC = "CALL get_document_id_by_work_id($1, $2)"

// Query to get a work ID by document ID
export const GET_WORK_ID_BY_DOCUMENT_ID_PROC = "CALL get_work_id_by_document_id($1, $2)"

// Query to update a work
export const UPDATE_WORK_PROC = "CALL update_work($1, $2, $3, $4, $5)"

// Query to create a new article
export const CREATE_ARTICLE_PROC = "CALL create_article($1, $2, $3, $4, $5)"

// Query to update an article
export const UPDATE_ARTICLE_PROC = "CALL update_article($1, $2, $3, $4, $5)"

// Query to create a new book copy
export const CREATE_BOOK_COPY_PROC = "CALL create_book_copy($1, $2, $3)"

// Query to update a book copy
export const UPDATE_BOOK_COPY_PROC = "CALL update_book_copy($1, $2)"

// Query to delete a book copy
export const DELETE_BOOK_COPY_PROC = "CALL delete_book_copy($1, $2)"

// Query to create a new magazine issue
export const CREATE_MAGAZINE_ISSUE_PROC = "CALL create_magazine_issue($1, $2, $3, $4, $5, $6, $7)"

// Query to update a magazine issue
export const UPDATE_MAGAZINE_ISSUE_PROC = "CALL update_magazine_issue($1, $2, $3, $4, $5, $6)"

// Query to create a new thesis
export const CREATE_THESIS_PROC = "CALL create_thesis($1, $2, $3, $4, $5)"

// Query to update a thesis
export const UPDATE_THESIS_PROC = "CALL update_thesis($1, $2, $3, $4, $5)"

// Query to get the user details by user ID
export const GET_USER_DETAILS_BY_USER_ID_PROC = "CALL get_user_details_by_user_id($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)"

// Query to set the method permissions
export const SET_METHOD_PERMISSIONS_PROC = "CALL set_method_permissions($1, $2, $3)"

// Query to create a new audit entry
export const CREATE_AUDIT_ENTRY_PROC = "CALL create_audit_entry($1, $2, $3, $4)"