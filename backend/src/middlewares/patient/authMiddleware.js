const jwt = require('jsonwebtoken');
const { Patient } = require('../../models');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');
    if(!token) {
        return res.status(401).json({ data: {}, error: 'Unauthorized - No token provided' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ',''), process.env.JWT_SECRET);
        if(decoded.type == 'clinician') {
            return res.status(401).json({ data: {}, error: "Unauthorized - You don't have access to this module" });
        }
        const patient = await Patient.findByPk(decoded.id);
        if (!patient) {
            return res.status(401).json({ 
                data: {},
                error: 'Unauthorized - Invalid user' 
            }); 
        }
        req.user = patient;
        next();
    } catch (error) {
        res.status(401).json({ data: {},error: 'Unauthorized - Invalid token' });
    }
}

const checkRole = (requiredRole) => async (req,res,next) => {
    if(req.user.role != requiredRole) {
        return res.status(401).json({ data: {}, error: 'Unauthorized - Permission Denied' });
    }
    next();
}

module.exports = { authMiddleware, checkRole }