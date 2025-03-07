import Joi from "joi";

// Assign user profile model
export const ASSIGN_USER_PROFILE = Joi.object({
    username: Joi.string().required().min(1),
    profile_id: Joi.number().required().min(1),
})

// Revoke user profile model
export const REVOKE_USER_PROFILE = Joi.object({
    username: Joi.string().required().min(1),
    profile_id: Joi.number().required().min(1),
})

// Search for a user by username model
export const SEARCH_USER_BY_USERNAME = Joi.object({
    username: Joi.string().required().min(1),
})

// Create user model
export const CREATE_USER = Joi.object({
    first_name: Joi.string().required().min(1),
    last_name: Joi.string().required().min(1),
    username: Joi.string().required().min(1),
    password: Joi.string().required().min(1),
    email: Joi.string().email().required().email(),
    document_number: Joi.string().required().min(1),
    document_type: Joi.string().required().valid('identity_document', 'passport'),
    document_country: Joi.string().required().min(1),
})

// Get user details by user ID
export const GET_USER_DETAILS_BY_USER_ID=Joi.object({
    id: Joi.number().required().min(1),
})