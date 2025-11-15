const bcrypt = require('bcryptjs');

// Compare a plain text password with a hashed password
async function comparePasswords(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = { comparePasswords };