
function checkAdmin(req, res, next) {
    if (req.user && req.user.rol === 'admin') {
        return next();
    }
    return res.status(403).json({ error: 'Access denied. Admins only.' });
}

module.exports = checkAdmin;