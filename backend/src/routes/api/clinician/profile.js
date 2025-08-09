const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../../../middlewares/clinician/authMiddleware') 
const profileController = require('../../../controllers/clinician/profileController');

const prefixUrlPath = '/api/clinician/';
router.get(prefixUrlPath + 'profile' , authMiddleware, profileController.detail) ;
router.put(prefixUrlPath + 'profile' , authMiddleware, profileController.updateProfile) ;

module.exports = router