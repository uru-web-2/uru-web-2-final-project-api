import Joi from 'joi';
import {REMOVE_ARTICLE} from "../Article/ArticleModel.js";

// Create book model
export const CREATE_BOOK = Joi.object({
    document_title: Joi.string().required().min(1).max(255),
    document_description: Joi.string().required().min(1).max(255),
    document_release_date: Joi.date().required(),
    document_pages: Joi.number().required().min(1),
    document_author: Joi.string().required().min(1).max(255),
    document_topic_ids: Joi.array().items(Joi.number().required().min(1)),
    document_location_section_ids: Joi.array().items(Joi.number().min(1)),
    document_language_ids: Joi.array().items(Joi.number().required().min(1)),
    book_isbn: Joi.string().required().min(1).max(255),
    book_publisher_id: Joi.number().required().min(1)
})

// Update book model
export const UPDATE_BOOK = Joi.object({
    id: Joi.number().required().min(1),
    document_title: Joi.string().required().min(1).max(255),
    document_description: Joi.string().required().min(1).max(255),
    document_release_date: Joi.date().required(),
    document_pages: Joi.number().required().min(1),
    document_author: Joi.string().required().min(1).max(255),
    document_create_document_topic_ids: Joi.array().items(Joi.number().min(1)),
    document_remove_document_topic_ids: Joi.array().items(Joi.number().min(1)),
    document_create_document_location_section_ids: Joi.array().items(Joi.number().min(1)),
    document_remove_document_location_section_ids: Joi.array().items(Joi.number().min(1)),
    document_create_document_language_ids: Joi.array().items(Joi.number().min(1)),
    document_remove_document_language_ids: Joi.array().items(Joi.number().min(1)),
    document_remove_document_document_image_uuids: Joi.array().items(Joi.string().min(1)),
})

// Remove book model
export const REMOVE_BOOK = Joi.object({
    id: Joi.number().required().min(1),
})