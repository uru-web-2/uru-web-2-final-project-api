import Joi from 'joi';

// Create topic model
export const CREATE_TOPIC = Joi.object({
    name: Joi.string().required().min(1),
    description: Joi.string().required().min(1)
})

// Update topic model
export const UPDATE_TOPIC = Joi.object({
    id: Joi.number().required().min(1),
    name: Joi.string().min(1),
    description: Joi.string().min(1)
})

// Remove topic model
export const REMOVE_TOPIC = Joi.object({
    id: Joi.number().required().min(1)
})

// Search topic by name model
export const SEARCH_TOPIC_BY_NAME = Joi.object({
    name: Joi.string().required().min(1)
})