const { verifyToken } = require('../utils/jwt');

// Middleware to verify JWT token
function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // Attach user info to request
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
}

module.exports = authenticate;