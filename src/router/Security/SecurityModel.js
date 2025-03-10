import Joi from "joi";

// Assign profile permission model
export const ASSIGN_PROFILE_PERMISSION = Joi.object({
    method_id: Joi.number().required().min(1),
    profile_id: Joi.number().required().min(1),
})

// Revoke profile permission model
export const REVOKE_PROFILE_PERMISSION = Joi.object({
    method_id: Joi.number().required().min(1),
    profile_id: Joi.number().required().min(1),
})

// Get profile permissions methods model
export const GET_PROFILE_PERMISSIONS_METHODS = Joi.object({
    profile_id: Joi.number().required().min(1),
    module_id: Joi.number().required().min(1),
    object_id: Joi.number().required().min(1),
})

// Get objects by module ID model
export const GET_OBJECTS_BY_MODULE_ID = Joi.object({
    module_id: Joi.number().required().min(1),
})

// Get methods model
export const GET_METHODS_BY_OBJECT_ID = Joi.object({
    object_id: Joi.number().required().min(1),
})

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