const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../../../middlewares/clinician/authMiddleware') 
const visitController = require('../../../controllers/clinician/visitController');

const prefixUrlPath = '/api/clinician/';

router.post(prefixUrlPath + 'visit' , authMiddleware, visitController.create);
router.get(prefixUrlPath + 'visit/patients' , authMiddleware, visitController.getPatients);
router.get(prefixUrlPath + 'visit/:id' , authMiddleware, visitController.detail);
router.put(prefixUrlPath + 'visit/:id' , authMiddleware, visitController.update);
router.patch(prefixUrlPath + 'visit/:id' , authMiddleware, visitController.updateStatus);
router.post(prefixUrlPath + 'visits' , authMiddleware, visitController.list);

module.exports = router