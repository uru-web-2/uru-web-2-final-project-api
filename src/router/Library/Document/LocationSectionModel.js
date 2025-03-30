import Joi from 'joi';

// Create document author model
export const CREATE_DOCUMENT_LOCATION_SECTION = Joi.object({
    location_section_id: Joi.number().required().min(1),
    document_id: Joi.number().required().min(1)
})

// Remove document author model
export const REMOVE_DOCUMENT_LOCATION_SECTION = Joi.object({
    location_section_id: Joi.number().required().min(1),
    document_id: Joi.number().required().min(1)
})

// Get document authors by document ID model
export const GET_DOCUMENT_LOCATION_SECTIONS_BY_DOCUMENT_ID = Joi.object({
    id: Joi.number().required().min(1)
})