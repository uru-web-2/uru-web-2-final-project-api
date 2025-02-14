import Joi from 'joi';

// SignUp model
export const SIGN_UP = Joi.object({
    first_name: Joi.string().required().min(1),
    last_name: Joi.string().required().min(1),
    username: Joi.string().required().min(1),
    password: Joi.string().required().min(1),
    email: Joi.string().email().required().email(),
    document_number: Joi.string().required().min(1),
    document_type: Joi.string().required().valid('identity_document', 'passport'),
    document_country: Joi.string().required().min(1),
})

// LogIn model
export const LOG_IN = Joi.object({
    username: Joi.string().required().min(1),
    password: Joi.string().required().min(1),
    profile: Joi.string(),
})

// Execute model
export const EXECUTE = Joi.object({
    modules: Joi.array().items(Joi.string().min(1)),
    method: Joi.string().min(1),
    parameters: Joi.array().items(Joi.any())
})