const Joi = require('joi');


loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    type: Joi.string().valid('patient','clinician').required()
});

module.exports = loginValidation;