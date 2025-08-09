const { Visit, Patient } = require('../../models');
const errorParser = require('../../helper/errorParser');
const uploadFiles = require('../../helper/fileUploaderHelper');
const { Sequelize, DataTypes, Op } = require('sequelize');
const visitValidation = require('../../validations/clinician/visitValidation');
const parseJoiErrors = require('../../helper/parseJoiErrors');

const visitController = {}

visitController.create =  async(req,res) => {
    try {
        const { error, value } = visitValidation.createOrUpdateSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ message: parseJoiErrors(error.details), data: {}, success: false });
        }
        req.body = value;
        req.body.clinicianId = req.user.id;
        const visit = new Visit(req.body);
        await visit.save();
        
        res.status(201).json({ message: 'Appointment added successfully',data: {}, success: true});
    } catch (error) {
        const parsedError = errorParser(error)
        res.status(parsedError.responseCode).json({ message: parsedError.error, data: {}, success: false });
    }
}

visitController.getPatients = async(req, res) => {
    try {
        const patients = await Patient.findAll({
            attributes: ['id', 'firstName', 'lastName'],
        });
        res.status(200).json({ message: '', data: patients, success: true });
    } catch (error) {
        const parsedError = errorParser(error)
        res.status(parsedError.responseCode).json({ success: false, message: parsedError.error, data: {} });
    }
}


visitController.update = async(req,res) => {
    try {
        const { error, value } = visitValidation.createOrUpdateSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ message: parseJoiErrors(error.details), data: {}, success: false });
        }
        req.body = value;
        const visitData = await Visit.findByPk(req.params.id);
        if(!visitData) {
            return res.status(400).json({ message: 'Appointment not found', data: {}, success: false });
        }
        visitData.patientId = req.body.patientId,
        visitData.doctorName = req.body.doctorName,
        visitData.type = req.body.type,
        visitData.notes = req.body.notes,
        visitData.appointmentDate = req.body.appointmentDate,
        visitData.appointmentTime = req.body.appointmentTime,
        visitData.status = req.body.status,
        await visitData.save();
        
        res.status(200).json({ message: 'Appointment updated successfully',data: visitData, success: true});
    } catch (error) {
        const parsedError = errorParser(error)
        res.status(parsedError.responseCode).json({ error: parsedError.error, data: {} });
    }
}

visitController.detail = async(req,res) => {
    try {
        const visit = await Visit.findByPk(req.params.id); 
        res.status(200).json({ message: '',data: visit, success: true});
    } catch (error) {
        const parsedError = errorParser(error)
        res.status(parsedError.responseCode).json({ message: parsedError.error, data: {}, success: false });
    }
}

visitController.list = async (req, res) => {
    try {
        const { 
            page = 1, 
            pageSize = 10, 
            search, 
            status, 
            thisMonth = 0, 
            today = 0, 
            month = 0, 
            year = 0, 
            doctor = "all" 
        } = req.body;

        const whereClause = { clinicianId: req.user.id };

        // Status filter
        if (status) {
            whereClause['status'] = status;
        }

        // Today filter
        if (today && today == 1) {
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            whereClause['appointmentDate'] = { [Sequelize.Op.between]: [startOfToday, endOfToday] };
        } 
        // Current month filter
        else if (thisMonth && thisMonth == 1) {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            whereClause['appointmentDate'] = { [Op.between]: [startOfMonth, endOfMonth] };
        } 
        // Specific month/year filter (for calendar view)
        else if (month && year) {
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0);
            whereClause['appointmentDate'] = { [Op.between]: [startOfMonth, endOfMonth] };
        }

        // Doctor filter
        if (doctor && doctor !== "all") {
            whereClause['doctorName'] = doctor; // Assuming doctorId is stored in Visit model
        }

        // Search filter
        if (search) {
            whereClause[Op.or] = [
                { doctorName: { [Op.like]: `%${search}%` } },
                { notes: { [Op.like]: `%${search}%` } }
            ];
        }
        console.log(whereClause)
        const visitsData = await Visit.getPaginatedVisits(whereClause, pageSize, page);

        res.status(200).json({
            data: visitsData.data,
            totalPages: parseInt(visitsData.totalPages),
            currentPage: parseInt(visitsData.currentPage),
            pageSize: parseInt(visitsData.pageSize),
            message: ''
        });

    } catch (error) {
        const parsedError = errorParser(error);
        res.status(parsedError.responseCode).json({ 
            message: parsedError.error, 
            data: {}, 
            success: false 
        });
    }
};


visitController.updateStatus = async(req,res) => {
    try {
        const visitId = req.params.id;
        const status = req.body.status;
        if(!status) {
            throw new Error('status required');
        }
        const visit = await Visit.update({
            status : status
        },{
            where: {
                id: visitId,
                clinicianId: req.user.id
            }
        });
        if(!visit) {
            throw new Error('Status not updated');
        }
        res.status(200).json({ message: 'Status updated successfully', success: true });
    } catch (error) {
        const parsedError = errorParser(error)
        res.status(parsedError.responseCode).json({ error: parsedError.error, success: false });
    }
}


module.exports = visitController;
