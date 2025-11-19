const bcrypt = require('bcryptjs');


async function comparePasswords(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = { comparePasswords };