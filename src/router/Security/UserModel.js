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