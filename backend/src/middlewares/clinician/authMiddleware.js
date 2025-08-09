const jwt = require('jsonwebtoken');
const { Clinician } = require('../../models');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');
    if(!token) {
        return res.status(401).json({ data: {}, succes: false, message: 'Unauthorized - No token provided' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ',''), process.env.JWT_SECRET);
        if(decoded.type == 'patient') {
            return res.status(401).json({ data: {},succes: false, message: "Unauthorized - You don't have access to this module" });
        }
        const clinician = await Clinician.findByPk(decoded.id);
        if (!clinician) {
            return res.status(401).json({ 
                data: {},
                error: 'Unauthorized - Invalid user' 
            }); 
        }
        req.user = clinician;
        next();
    } catch (error) {
        res.status(401).json({ data: {},succes: false, message: 'Unauthorized - Invalid token' });
    }
}

const checkRole = (requiredRole) => async (req,res,next) => {
    if(req.user.role != requiredRole) {
        return res.status(401).json({ data: {}, succes: false, message: 'Unauthorized - Permission Denied' });
    }
    next();
}

module.exports = { authMiddleware, checkRole }