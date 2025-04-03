import Joi from 'joi';
import {IDENTITY_DOCUMENT, PASSPORT} from "../database/model/constants.js";

// Sign up model
export const SIGN_UP = Joi.object({
    first_name: Joi.string().required().min(1),
    last_name: Joi.string().required().min(1),
    username: Joi.string().required().min(1),
    password: Joi.string().required().min(1),
    email: Joi.string().email().required().email(),
    document_number: Joi.string().required().min(1),
    document_type: Joi.string().required().valid(IDENTITY_DOCUMENT,
        PASSPORT
    ),
    document_country_name: Joi.string().required().min(1),
})

// Log in model
export const LOG_IN = Joi.object({
    username: Joi.string().required().min(1),
    password: Joi.string().required().min(1),
    profile: Joi.string(),
})

// Execute model
export const EXECUTE = Joi.object({
    modules: Joi.array().items(Joi.string().min(1)),
    object: Joi.string().required().min(1),
    method: Joi.string().required().min(1),
    parameters: Joi.object()
})

// Verify email model
export const VERIFY_EMAIL = Joi.object({
    token: Joi.string().required().uuid()
})

// Forgot password model
export const FORGOT_PASSWORD = Joi.object({
    email: Joi.string().email().required().email()
})

// Reset password model
export const RESET_PASSWORD = Joi.object({
    token: Joi.string().required().uuid(),
    password: Joi.string().required().min(1)
})