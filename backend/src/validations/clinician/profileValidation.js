const Joi = require('joi');

const profileValidation = {};

profileValidation.updateSchema = Joi.object({
    name: Joi.string().trim().required(),
    mobile: Joi.number().min(1111111111).max(9999999999).required().error((err)=>{
        err[0].message = 'Invalid mobile no, Please enter 10 digit';
        return err;
    }),
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().min(8),
    website: Joi.string().trim().min(1),
    address: Joi.string().trim().min(1),
    operatingHours: Joi.string().trim().min(1),
    emergencyMobile: Joi.string(),
    totalDoctor: Joi.number(),
    totalStaff: Joi.number(),
    licenseNumber: Joi.string().trim(),
    description: Joi.string().trim(),
    specialties: Joi.string().trim()
});

module.exports = profileValidation;