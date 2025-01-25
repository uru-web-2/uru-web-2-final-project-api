import Joi from 'joi';

// SignUp model
export const SIGN_UP = Joi.object({
    first_name: Joi.string().required().min(1),
    last_name: Joi.string().required().min(1),
    username: Joi.string().required().min(1),
    password: Joi.string().required().min(1),
    email: Joi.string().email().required(),
    birthdate: Joi.date().required(),
})

// LogIn model
export const LOG_IN = Joi.object({
    username: Joi.string().required().min(1),
    password: Joi.string().required().min(1),
})