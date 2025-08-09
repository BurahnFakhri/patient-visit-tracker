const { Clinician } = require('../../models');
const errorParser = require('../../helper/errorParser');
const uploadFiles = require('../../helper/fileUploaderHelper');
const profileValidation = require('../../validations/clinician/profileValidation');
const parseJoiErrors = require('../../helper/parseJoiErrors');

const profileController = {}

profileController.detail = async(req,res) => {
    const user = req.user;
    delete user.dataValues.password;

    res.status(200).json({ message: "", data: user, success: true });
}

profileController.updateProfile = async (req, res) => {
    const { error, value } = profileValidation.updateSchema.validate(req.body, { abortEarly: false });
    req.body = value;
    if (error) {
        return res.status(200).json({ success: false, message: parseJoiErrors(error.details), data: {} });
    }
    const reqBodyKey = Object.keys(req.body);
    const allowUpdates = [
        'name','mobile','email','password','website','address','operatingHours','emergencyMobile',
        'totalDoctor','totalStaff','licenseNumber','description','specialties'
    ];
    const isValidKeys = reqBodyKey.every((update)=>allowUpdates.includes(update));
    if (!isValidKeys) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    try {
        reqBodyKey.forEach((update) => req.user[update] = req.body[update]);
        if(req.files?.image) {
            image = await uploadFiles(req.files.image,'uploads/clinician/',['.png','.jpeg','.jpg']);
            if(image) {
                req.user.image = image;
            }
        }
        if(!req.body.password) {
            delete req.user.password;
        }
        await req.user.save();
        delete req.user.dataValues.password;
        res.status(200).json({ message: '',data: req.user, success: true});
    } catch (error) {
        const parsedError = errorParser(error)
        res.status(parsedError.responseCode).json({ message: parsedError.error, data: {}, success: false });
    }
}



module.exports = profileController