const Joi = require('joi');

const visitValidation = {};

visitValidation.createOrUpdateSchema = Joi.object({
    patientId: Joi.string().required(),
    doctorName: Joi.string().required(),
    type: Joi.string().valid('consult', 'followUp', 'checkup', 'emergency').required(),
    notes: Joi.string().optional(),
    appointmentDate: Joi.date().required(),
    appointmentTime: Joi.string().required(),
    status: Joi.string().valid('pending', 'confirm', 'complete', 'cancel').required(),
});


module.exports = visitValidation;