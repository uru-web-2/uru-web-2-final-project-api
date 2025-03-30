import Joi from 'joi';

// Create thesis model
export const CREATE_THESIS = Joi.object({
    document_title: Joi.string().required().min(1).max(255),
    document_description: Joi.string().required().min(1).max(255),
    document_release_date: Joi.date().required(),
    document_pages: Joi.number().required().min(1),
    document_author: Joi.string().required().min(1).max(255),
    document_topic_ids: Joi.array().items(Joi.number().required().min(1)).required(),
    document_location_section_ids: Joi.array().items(Joi.number().required().min(1)).required(),
    document_language_ids: Joi.array().items(Joi.number().required().min(1)).required(),
})