const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../../../middlewares/patient/authMiddleware') 
const profileController = require('../../../controllers/patient/profileController');

const prefixUrlPath = '/api/patient/';
router.get(prefixUrlPath + 'profile' , authMiddleware, profileController.detail) ;
router.put(prefixUrlPath + 'profile' , authMiddleware, profileController.updateProfile) ;

module.exports = router