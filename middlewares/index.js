require('dotenv').config();
const client = require('../config/db');
const jwt = require('jsonwebtoken');

exports.authorizeToken = async (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization'];
        if (!bearerHeader) return res.status(401).send('Unauthorized');
        
        const token = bearerHeader.split(' ')[1];

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

exports.registerValidator = (req, res, next) => {
    req.check('first_name', 'First name required').notEmpty();
    req.check('last_name', 'Last name required').notEmpty();
    req.check('email', 'Email required').notEmpty();
    req.check('password', 'Password required').notEmpty();
    req.check('phone', 'Phone number required').notEmpty();
    req.check('hourly_pay', 'Hourly pay required').notEmpty();
    req.check('started_at', 'Starting date required').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors[0].msg);
    }

    next();
}