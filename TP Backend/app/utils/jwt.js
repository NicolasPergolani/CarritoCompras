const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key'; // Replace with a secure key in production

// Generate a JWT token
function generateToken(payload, expiresIn = '1h') {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Verify a JWT token
function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        throw new Error('Invalid or expired token');
    }
}

module.exports = { generateToken, verifyToken };