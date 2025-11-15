// Middleware to check if the user has admin permissions
function checkAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ error: 'Access denied. Admins only.' });
}

module.exports = checkAdmin;