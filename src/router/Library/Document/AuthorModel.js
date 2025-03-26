import Joi from 'joi';

// Assign document author model
export const ASSIGN_DOCUMENT_AUTHOR = Joi.object({
    author_id: Joi.number().required().min(1),
    document_id: Joi.number().required().min(1)
})

// Remove document author model
export const REMOVE_DOCUMENT_AUTHOR = Joi.object({
    author_id: Joi.number().required().min(1),
    document_id: Joi.number().required().min(1)
})

// Get document authors by document ID model
export const GET_DOCUMENT_AUTHORS_BY_DOCUMENT_ID = Joi.object({
    id: Joi.number().required().min(1)
})