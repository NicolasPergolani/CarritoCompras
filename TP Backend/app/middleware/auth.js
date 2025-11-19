const { verifyToken } = require('../utils/jwt');


function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    try {
        const decoded = verifyToken(token);
        req.user = decoded; 
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
}

module.exports = authenticate;