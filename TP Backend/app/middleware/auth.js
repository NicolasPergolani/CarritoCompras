const { verifyToken } = require('../utils/jwt');

// Middleware to verify JWT token
function authenticate(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // Attach user info to request
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
}

module.exports = authenticate;