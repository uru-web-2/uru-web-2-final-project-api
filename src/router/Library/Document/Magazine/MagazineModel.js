import Joi from "joi";

// Create magazine
export const CREATE_MAGAZINE = Joi.object({
    name: Joi.string().required().min(1),
    description: Joi.string().required().min(1),
    release_date: Joi.date().required(),
})

// Update magazine
export const UPDATE_MAGAZINE = Joi.object({
    id: Joi.number().required().min(1),
    name: Joi.string().required().min(1),
    description: Joi.string().required().min(1),
    release_date: Joi.date().required(),
})

// Remove magazine
export const REMOVE_MAGAZINE = Joi.object({
    id: Joi.number().required().min(1)
})

// Get all magazines
export const GET_ALL_MAGAZINES = Joi.object({
    limit: Joi.number().required().min(1),
    offset: Joi.number().required().min(0),
})

// Search for a magazine by name
export const SEARCH_MAGAZINE_BY_NAME = Joi.object({
    name: Joi.string().required().min(1),
    limit: Joi.number().required().min(1),
})

