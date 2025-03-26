import Joi from 'joi';

// Assign document topic model
export const ASSIGN_DOCUMENT_TOPIC = Joi.object({
    topic_id: Joi.number().required().min(1),
    document_id: Joi.number().required().min(1)
})

// Remove document topic model
export const REMOVE_DOCUMENT_TOPIC = Joi.object({
    topic_id: Joi.number().required().min(1),
    document_id: Joi.number().required().min(1)
})

// Get document topics by document ID model
export const GET_DOCUMENT_TOPICS_BY_DOCUMENT_ID = Joi.object({
    id: Joi.number().required().min(1)
})