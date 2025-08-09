const { Clinician, Patient } = require('../models');
const jwt = require('jsonwebtoken');
const loginValidation = require('../validations/loginValidation');
const parseJoiErrors = require('../helper/parseJoiErrors');
const errorParser = require('../helper/errorParser');
const uploadFiles = require('../helper/fileUploaderHelper');

const authController = {}

authController.login = async(req,res) => {
    const { error } = loginValidation.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: parseJoiErrors(error.details), data: {}, succes: false });
    }

    const {email,password, type} = req.body;
    let user = {};
    if(type === 'clinician') {
        user = await Clinician.authenticate(email, password)
    } else {
        user = await Patient.authenticate(email, password)
    }
    if(!user) {
        return res.status(401).json({ 
            data: {},
            error: 'Invalid email or password' 
        });
    }
    
    const accessToken = jwt.sign(
        {id: user.id, type},
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m'}
    );
    // user.dataValues.refreshToken = jwt.sign(
    //     { id: user.id, type },
    //     process.env.JWT_REFRESH_SECRET, 
    //     { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'}
    // );

    delete user.dataValues.password;
    res.status(200).json({data:user.dataValues, token:accessToken,  message:'Login successfull', success: true});
}


module.exports = authController