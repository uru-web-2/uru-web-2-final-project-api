import Joi from 'joi';

// Create location section model
export const CREATE_LOCATION_SECTION = Joi.object({
    location_id: Joi.number().required().min(1),
    name: Joi.string().required().min(1),
})

// Update location model
export const UPDATE_LOCATION_SECTION = Joi.object({
    id: Joi.number().required().min(1),
    name: Joi.string().required().min(1),
})

// Remove location model
export const REMOVE_LOCATION_SECTION = Joi.object({
    id: Joi.number().required().min(1),
})

// Get all locations sections model
export const GET_ALL_LOCATION_SECTIONS = Joi.object({
    limit: Joi.number().required().min(1),
    offset: Joi.number().required().min(0),
})

// Get location sections by location ID model
export const GET_LOCATION_SECTIONS_BY_LOCATION_ID = Joi.object({
    location_id: Joi.string().required().min(1),
})