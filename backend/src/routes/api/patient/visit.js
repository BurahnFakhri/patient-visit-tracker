const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../../../middlewares/patient/authMiddleware') 
const visitController = require('../../../controllers/patient/visitController');

const prefixUrlPath = '/api/patient/';

router.post(prefixUrlPath + 'visits' , authMiddleware, visitController.list);

module.exports = router