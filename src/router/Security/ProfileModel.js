import Joi from "joi";

// Create profile model
export const CREATE_PROFILE = Joi.object({
    name: Joi.string().required().min(1),
    description: Joi.string().required().min(1),
})

// Update profile model
export const UPDATE_PROFILE = Joi.object({
    id: Joi.number().required().min(1),
    name: Joi.string().min(1),
    description: Joi.string().min(1),
})

// Delete profile model
export const DELETE_PROFILE = Joi.object({
    id: Joi.number().required().min(1),
})

// Search for a profile by name model
export const SEARCH_PROFILE_BY_NAME = Joi.object({
    name: Joi.string().required().min(1),
})