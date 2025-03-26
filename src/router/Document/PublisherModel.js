import Joi from 'joi';

// Create publisher model
export const CREATE_PUBLISHER_MODEL = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required()
})

// Update publisher model
export const UPDATE_PUBLISHER_MODEL = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().required()
})

// Delete publisher model
export const DELETE_PUBLISHER_MODEL = Joi.object({
    id: Joi.number().required()
})