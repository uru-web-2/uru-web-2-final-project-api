import Joi from 'joi';

// Create document language model
export const CREATE_DOCUMENT_LANGUAGE = Joi.object({
    language_id: Joi.number().required().min(1),
    document_id: Joi.number().required().min(1)
})

// Remove document language model
export const REMOVE_DOCUMENT_LANGUAGE = Joi.object({
    language_id: Joi.number().required().min(1),
    document_id: Joi.number().required().min(1)
})

// Get document languages by document ID model
export const GET_DOCUMENT_LANGUAGES_BY_DOCUMENT_ID = Joi.object({
    id: Joi.number().required().min(1)
})