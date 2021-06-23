require('dotenv').config();
const client = require('../config/db');
const jwt = require('jsonwebtoken');

exports.authorizeToken = async (req, res, next) => {
    try {
        const token = req.header('token');

        if (!token) return res.status(401).send('Unauthorized');

        const payload = jwt.verify(token, process.env.JWT);
        req.id = payload.id; // payload.id comes from jwt.sign in signIn method
    } catch (err) {
        res.status(500).send(err.message);
    }

    next();
}

exports.isAdmin = async (req, res, next) => {
    try {
        const user = await client.query(
            `SELECT is_admin
            FROM users JOIN roles
                ON users.role_id = roles.role_id
            WHERE u_id = $1`,
            [req.id]
        )

        if (!user.rows[0].is_admin) return res.status(401).send('Unauthorized');
    } catch (err) {
        res.status(500).send(err.message);
    }

    next();
}