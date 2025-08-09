const Joi = require('joi');

const profileValidation = {};

profileValidation.updateSchema = Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    dob: Joi.date().required(),
    mobile: Joi.number().min(1111111111).max(9999999999).required().error((err)=>{
        err[0].message = 'Invalid mobile no, Please enter 10 digit';
        return err;
    }),
    allergies: Joi.string().trim().min(1),
    currentMedication: Joi.string().trim().min(1),
    medicalHistory: Joi.string().trim().min(1),
    emergencyMobile: Joi.string().trim().min(1),
    email: Joi.string().email().trim().required(),
    address: Joi.string().trim().required()
});

module.exports = profileValidation;