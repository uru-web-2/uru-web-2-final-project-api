import Joi from 'joi';

// Search country by name model
export const SEARCH_COUNTRY_BY_NAME = Joi.object({
    name: Joi.string().required().min(1)
})