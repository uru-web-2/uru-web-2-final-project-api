import Joi from "joi";

// AddProfile model
export const ADD_PROFILE = Joi.object({
    username: Joi.string().required().min(1),
    profile: Joi.string().required().min(1),
})