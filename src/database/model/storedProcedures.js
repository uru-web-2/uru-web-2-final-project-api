// Query to get a country ID by name
export const GET_COUNTRY_ID_BY_NAME_PROC = "CALL get_country_id_by_name($1, $2)"

// Query to create a new user personal document
export const CREATE_USER_PERSONAL_DOCUMENT_PROC = "CALL create_user_personal_document($1, $2, $3, $4, $5)"

// Query to remove a user personal document
export const REMOVE_USER_PERSONAL_DOCUMENT_PROC = "CALL remove_user_personal_document($1, $2, $3)"

// Query to replace a user personal document
export const REPLACE_USER_PERSONAL_DOCUMENT_PROC = "CALL replace_user_personal_document($1, $2, $3, $4, $5)"

// Query to create a new person
export const CREATE_PERSON_PROC = "CALL create_person($1, $2, $3, $4, $5, $6, $7)"

// Query to create a new user email
export const CREATE_USER_EMAIL_PROC = "CALL create_user_email($1, $2, $3, $4, $5)"

// Query to update a user email
export const UPDATE_USER_EMAIL_PROC = "CALL update_user_email($1, $2, $3, $4, $5)"

// Query to remove a user email verification token by user email ID
export const REMOVE_USER_EMAIL_VERIFICATION_TOKEN_BY_USER_EMAIL_ID_PROC = "CALL remove_user_email_verification_token_by_user_email_id($1)"

// Query to create a new user email verification token
export const CREATE_USER_EMAIL_VERIFICATION_TOKEN_PROC = "CALL create_user_email_verification_token($1, $2, $3, $4)"

// Query to get the user email information by user ID
export const GET_USER_EMAIL_INFO_BY_USER_ID_PROC = "CALL get_user_email_info_by_user_id($1, $2, $3, $4, $5)"

// Query to get the user email information by user email
export const GET_USER_EMAIL_INFO_BY_USER_EMAIL_PROC = "CALL get_user_email_info_by_user_email($1, $2, $3, $4, $5)"

// Query to verify a user email verification token
export const VERIFY_USER_EMAIL_VERIFICATION_TOKEN_PROC = "CALL verify_user_email_verification_token($1, $2)"

// Query to remove a user reset password token by user ID
export const REMOVE_USER_RESET_PASSWORD_TOKEN_BY_USER_ID_PROC = "CALL remove_user_reset_password_token_by_user_id($1)"

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

// Query to create a profile to a user
export const CREATE_USER_PROFILE_PROC = "CALL create_user_profile($1, $2, $3, $4, $5)"

// Query to remove a profile from a user
export const REMOVE_USER_PROFILE_PROC = "CALL remove_user_profile($1, $2, $3, $4, $5)"

// Query to create a permission to a profile
export const CREATE_PROFILE_PERMISSION_PROC = "CALL create_profile_permission($1, $2, $3, $4, $5, $6)"

// Query to remove a permission from a profile
export const REMOVE_PROFILE_PERMISSION_PROC = "CALL remove_profile_permission($1, $2, $3, $4, $5, $6)"

// Query to create a profile
export const CREATE_PROFILE_PROC = "CALL create_profile($1, $2, $3)"

// Query to update a profile
export const UPDATE_PROFILE_PROC = "CALL update_profile($1, $2, $3, $4)"

// Query to remove a profile
export const REMOVE_PROFILE_PROC = "CALL remove_profile($1, $2, $3)"

// Query to create a new module
export const CREATE_MODULE_PROC = "CALL create_module($1, $2, $3, $4)"

// Query to create a new object
export const CREATE_OBJECT_PROC = "CALL create_object($1, $2, $3, $4)"

// Query to create a new method
export const CREATE_METHOD_PROC = "CALL create_method($1, $2, $3, $4)"

// Query to remove all modules
export const REMOVE_ALL_MODULES_PROC = "CALL remove_all_modules($1)"

// Query to create a new method with the profiles for the permissions
export const CREATE_METHOD_WITH_PROFILES_PROC = "CALL create_method_with_profiles($1, $2, $3, $4, $5)"

// Query to get the module ID by name
export const GET_MODULE_ID_BY_NAME_PROC = "CALL get_module_id_by_name($1, $2, $3)"

// Query to get the object ID by name
export const GET_OBJECT_ID_BY_NAME_PROC = "CALL get_object_id_by_name($1, $2, $3)"

// Query to get the method ID by name
export const GET_METHOD_ID_BY_NAME_PROC = "CALL get_method_id_by_name($1, $2, $3)"

// Query to get the number of users
export const GET_NUMBER_OF_USERS_PROC = "CALL get_number_of_users($1)"

// Query to update a user username
export const UPDATE_USER_USERNAME_PROC = "CALL update_user_username($1, $2)"

// Query to update a user by admin
export const UPDATE_USER_BY_ADMIN_PROC = "CALL update_user_by_admin($1, $2, $3, $4, $5, $6, $7, $8, $9)"

// Query to create a new document
export const CREATE_DOCUMENT_PROC = "CALL create_document($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)"

// Query to update a document
export const UPDATE_DOCUMENT_PROC = "CALL update_document($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)"

// Query to remove a document
export const REMOVE_DOCUMENT_PROC = "CALL remove_document($1, $2)"

// Query to create a new document image
export const CREATE_DOCUMENT_IMAGE_PROC = "CALL create_document_image($1, $2, $3, $4)"

// Query to remove a document image
export const REMOVE_DOCUMENT_IMAGE_PROC = "CALL remove_document_image($1, $2)"

// Query to create a new document language
export const CREATE_DOCUMENT_LANGUAGE_PROC = "CALL create_document_language($1, $2, $3)"

// Query to remove a document language
export const REMOVE_DOCUMENT_LANGUAGE_PROC = "CALL remove_document_language($1, $2)"

// Query to create a new post
export const CREATE_POST_PROC = "CALL create_post($1, $2, $3)"

// Query to update a post
export const UPDATE_POST_PROC = "CALL update_post($1, $2)"

// Query to remove a post
export const REMOVE_POST_PROC = "CALL remove_post($1, $2)"

// Query to create a new location
export const CREATE_LOCATION_PROC = "CALL create_location($1, $2, $3, $4)"

// Query to update a location
export const UPDATE_LOCATION_PROC = "CALL update_location($1, $2, $3, $4)"

// Query to remove a location
export const REMOVE_LOCATION_PROC = "CALL remove_location($1, $2, $3)"

// Query to create a new location section
export const CREATE_LOCATION_SECTION_PROC = "CALL create_location_section($1, $2, $3, $4)"

// Query to update a location section
export const UPDATE_LOCATION_SECTION_PROC = "CALL update_location_section($1, $2, $3)"

// Query to remove a location section
export const REMOVE_LOCATION_SECTION_PROC = "CALL remove_location_section($1, $2, $3)"

// Query to create a location section to a document
export const CREATE_DOCUMENT_LOCATION_SECTION_PROC = "CALL create_document_location_section($1, $2, $3)"

// Query to remove a location section from a document
export const REMOVE_DOCUMENT_LOCATION_SECTION_PROC = "CALL remove_document_location_section($1, $2, $3)"

// Query to create a new topic
export const CREATE_TOPIC_PROC = "CALL create_topic($1, $2, $3, $4)"

// Query to update a topic
export const UPDATE_TOPIC_PROC = "CALL update_topic($1, $2, $3, $4)"

// Query to remove a topic
export const REMOVE_TOPIC_PROC = "CALL remove_topic($1, $2, $3)"

// Query to create a topic to a document
export const CREATE_DOCUMENT_TOPIC_PROC = "CALL create_document_topic($1, $2, $3)"

// Query to remove a topic from a document
export const REMOVE_DOCUMENT_TOPIC_PROC = "CALL remove_document_topic($1, $2, $3)"

// Query to create a new magazine
export const CREATE_MAGAZINE_PROC = "CALL create_magazine($1, $2, $3, $4)"

// Query to update a magazine
export const UPDATE_MAGAZINE_PROC = "CALL update_magazine($1, $2, $3, $4)"

// Query to remove a magazine
export const REMOVE_MAGAZINE_PROC = "CALL remove_magazine($1, $2)"

// Query to set the profile permissions
export const SET_PROFILE_PERMISSIONS_PROC = "CALL set_profile_permissions($1, $2, $3, $4)"

// Query to create a new publisher
export const CREATE_PUBLISHER_PROC = "CALL create_publisher($1, $2, $3, $4)"

// Query to update a publisher
export const UPDATE_PUBLISHER_PROC = "CALL update_publisher($1, $2, $3, $4)"

// Query to remove a publisher
export const REMOVE_PUBLISHER_PROC = "CALL remove_publisher($1, $2, $3)"

// Query to create a new document review
export const CREATE_DOCUMENT_REVIEW_PROC = "CALL create_document_review($1, $2, $3, $4, $5, $6)"

// Query to update a document review
export const UPDATE_DOCUMENT_REVIEW_PROC = "CALL update_document_review($1, $2, $3, $4)"

// Query to remove a document review
export const REMOVE_DOCUMENT_REVIEW_PROC = "CALL remove_document_review($1, $2)"

// Query to get the document ID by book ID
export const GET_DOCUMENT_ID_BY_BOOK_ID_PROC = "CALL get_document_id_by_book_id($1, $2)"

// Query to create a new book
export const CREATE_BOOK_PROC = "CALL create_book($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)"

// Query to update a book
export const UPDATE_BOOK_PROC = "CALL update_book($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)"

// Query to create a new work
export const CREATE_WORK_PROC = "CALL create_work($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)"

// Query to get a document ID by work ID
export const GET_DOCUMENT_ID_BY_WORK_ID_PROC = "CALL get_document_id_by_work_id($1, $2)"

// Query to get a work ID by document ID
export const GET_WORK_ID_BY_DOCUMENT_ID_PROC = "CALL get_work_id_by_document_id($1, $2)"

// Query to update a work
export const UPDATE_WORK_PROC = "CALL update_work($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)"

// Query to create a new article
export const CREATE_ARTICLE_PROC = "CALL create_article($1, $2, $3, $4, $5, $6,$7, $8, $9, $10, $11, $12)"

// Query to update an article
export const UPDATE_ARTICLE_PROC = "CALL update_article($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)"

// Query to create a new book copy
export const CREATE_BOOK_COPY_PROC = "CALL create_book_copy($1, $2, $3)"

// Query to update a book copy
export const UPDATE_BOOK_COPY_PROC = "CALL update_book_copy($1, $2)"

// Query to remove a book copy
export const REMOVE_BOOK_COPY_PROC = "CALL remove_book_copy($1, $2)"

// Query to create a new magazine issue
export const CREATE_MAGAZINE_ISSUE_PROC = "CALL create_magazine_issue($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)"

// Query to update a magazine issue
export const UPDATE_MAGAZINE_ISSUE_PROC = "CALL update_magazine_issue($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)"

// Query to create a new thesis
export const CREATE_THESIS_PROC = "CALL create_thesis($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)"

// Query to update a thesis
export const UPDATE_THESIS_PROC = "CALL update_thesis($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)"

// Query to get the user details by user ID
export const GET_USER_DETAILS_BY_USER_ID_PROC = "CALL get_user_details_by_user_id($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)"

// Query to set the method permissions
export const SET_METHOD_PERMISSIONS_PROC = "CALL set_method_permissions($1, $2, $3, $4)"

// Query to create a new audit entry
export const CREATE_AUDIT_ENTRY_PROC = "CALL create_audit_entry($1, $2, $3, $4)"

// Query to create a jury member to an article
export const CREATE_ARTICLE_JURY_MEMBER_PROC = "CALL create_article_jury_member($1, $2, $3)"

// Query to remove a jury member from an article
export const REMOVE_ARTICLE_JURY_MEMBER_PROC = "CALL remove_article_jury_member($1, $2, $3)"

// Query to create a new article annotation
export const CREATE_ARTICLE_ANNOTATION_PROC = "CALL create_article_annotation($1, $2, $3, $4)"

// Query to update an article annotation
export const UPDATE_ARTICLE_ANNOTATION_PROC = "CALL update_article_annotation($1, $2, $3)"

// Query to mark an article annotation as resolved
export const RESOLVE_ARTICLE_ANNOTATION_PROC = "CALL resolve_article_annotation($1, $2)"

// Query to set a book copy as lost
export const SET_BOOK_COPY_AS_LOST_PROC = "CALL set_book_copy_as_lost($1, $2)"

// Query to register a new book copy loan with reservation
export const REGISTER_BOOK_COPY_LOAN_WITH_RESERVATION_PROC = "CALL register_book_copy_loan_with_reservation($1, $2, $3, $4)"

// Query to register a new book copy loan without reservation
export const REGISTER_BOOK_COPY_LOAN_WITHOUT_RESERVATION_PROC = "CALL register_book_copy_loan_without_reservation($1, $2, $3, $4, $5)"

// Query to set the book copy loan reservation as borrowed
export const SET_BOOK_COPY_LOAN_RESERVATION_AS_BORROWED_PROC = "CALL set_book_copy_loan_reservation_as_borrowed($1, $2, $3, $4)"

// Query to set the book copy loan as returned
export const SET_BOOK_COPY_LOAN_AS_RETURNED_PROC = "CALL set_book_copy_loan_as_returned($1, $2, $3, $4)"

// Query to set the book copy loan as lost
export const SET_BOOK_COPY_LOAN_AS_LOST_PROC = "CALL set_book_copy_loan_as_lost($1, $2)"

// Query to remove a book copy loan
export const REMOVE_BOOK_COPY_LOAN_PROC = "CALL remove_book_copy_loan($1, $2)"

// Query to get the permissions by method ID
export const GET_PERMISSIONS_BY_METHOD_ID_PROC = "CALL get_permissions_by_method_id($1, $2)"