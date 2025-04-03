import Joi from "joi";

// Create profile permission model
export const CREATE_PROFILE_PERMISSION = Joi.object({
    method_id: Joi.number().required().min(1),
    profile_id: Joi.number().required().min(1),
})

// Remove profile permission model
export const REMOVE_PROFILE_PERMISSION = Joi.object({
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

// Create user profile model
export const CREATE_USER_PROFILE = Joi.object({
    username: Joi.string().required().min(1),
    profile_id: Joi.number().required().min(1),
})

// Remove user profile model
export const REMOVE_USER_PROFILE = Joi.object({
    username: Joi.string().required().min(1),
    profile_id: Joi.number().required().min(1),
})

// Get methods by profile ID and object ID model
export const GET_METHODS_BY_PROFILE_ID_OBJECT_ID = Joi.object({
    profile_id: Joi.number().required().min(1),
    object_id: Joi.number().required().min(1),
})

// Set profile permissions model
export const SET_PROFILE_PERMISSIONS = Joi.object({
    profile_id: Joi.number().required().min(1),
    create_method_ids: Joi.array().items(Joi.number()),
    remove_method_ids: Joi.array().items(Joi.number()),
})