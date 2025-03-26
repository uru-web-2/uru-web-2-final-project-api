import Joi from 'joi';

// Create publisher model
export const CREATE_PUBLISHER = Joi.object({
    name: Joi.string().required().min(1),
    description: Joi.string().required().min(1)
})

// Update publisher model
export const UPDATE_PUBLISHER = Joi.object({
    id: Joi.number().required().min(1),
    name: Joi.string().required().min(1),
    description: Joi.string().required().min(1)
})

// Delete publisher model
export const DELETE_PUBLISHER = Joi.object({
    id: Joi.number().required().min(1)
})

// Search for a publisher by name model
export const SEARCH_PUBLISHER_BY_NAME = Joi.object({
    name: Joi.string().required().min(1)
})