import Joi from 'joi';

// Create article model
export const CREATE_ARTICLE = Joi.object({
    document_title: Joi.string().required().min(1).max(255),
    document_description: Joi.string().required().min(1).max(4000),
    document_release_date: Joi.date().required(),
    document_pages: Joi.number().required().min(1),
    document_authors: Joi.array().items(Joi.string().min(1).max(255)),
    document_topic_ids: Joi.array().items(Joi.number().required().min(1)).required(),
    document_location_section_ids: Joi.array().items(Joi.number().required().min(
        1)).required(),
    document_language_ids: Joi.array().items(Joi.number().required().min(1)).required(),
})

// Update article model
export const UPDATE_ARTICLE = Joi.object({
    id: Joi.number().required().min(1),
    document_title: Joi.string().min(1).max(255),
    document_description: Joi.string().min(1).max(4000),
    document_release_date: Joi.date(),
    document_pages: Joi.number().min(1),
    document_authors: Joi.array().items(Joi.string().min(1).max(255)),
    document_create_document_topic_ids: Joi.array().items(Joi.number().min(1)),
    document_remove_document_topic_ids: Joi.array().items(Joi.number().min(1)),
    document_create_document_location_section_ids: Joi.array().items(Joi.number().min(
        1)),
    document_remove_document_location_section_ids: Joi.array().items(Joi.number().min(
        1)),
    document_create_document_language_ids: Joi.array().items(Joi.number().min(1)),
    document_remove_document_language_ids: Joi.array().items(Joi.number().min(1)),
    document_remove_document_document_image_uuids: Joi.array().items(Joi.string().min(
        1)),
})

// Remove article model
export const REMOVE_ARTICLE = Joi.object({
    id: Joi.number().required().min(1),
})