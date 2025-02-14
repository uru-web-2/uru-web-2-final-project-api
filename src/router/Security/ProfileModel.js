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

// Create profile model
export const CREATE_PROFILE = Joi.object({
    name: Joi.string().required().min(1),
})

// Update profile model
export const UPDATE_PROFILE = Joi.object({
    id: Joi.number().required().min(1),
    name: Joi.string().required().min(1),
})

// Delete profile model
export const DELETE_PROFILE = Joi.object({
    id: Joi.number().required().min(1),
})

// Get profile permissions methods model
export const GET_PROFILE_PERMISSIONS_METHODS = Joi.object({
    id: Joi.number().required().min(1),
})