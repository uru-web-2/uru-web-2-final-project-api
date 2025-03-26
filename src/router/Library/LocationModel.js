import Joi from 'joi';

// Create location model
export const CREATE_LOCATION = Joi.object({
    floor: Joi.string().required().min(1),
    area: Joi.string().required().min(1),
})

// Update location model
export const UPDATE_LOCATION = Joi.object({
    id: Joi.number().required().min(1),
    floor: Joi.string().required().min(1),
    area: Joi.string().required().min(1),
})

// Delete location model
export const DELETE_LOCATION = Joi.object({
    id: Joi.number().required().min(1),
})

// Get all locations model
export const GET_ALL_LOCATIONS = Joi.object({
    limit: Joi.number().required().min(1),
    offset: Joi.number().required().min(0),
})