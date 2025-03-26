import Joi from 'joi';

// Search language by name model
export const SEARCH_LANGUAGE_BY_NAME = Joi.object({
    name: Joi.string().required().min(1)
})