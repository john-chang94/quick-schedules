require('dotenv').config();
const client = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    try {
        let {
            role_id,
            first_name,
            last_name,
            email,
            password,
            phone,
            hourly_pay,
            started_at,
            updated_at
        } = req.body;

        // Check if user exists
        const foundUser = await client.query('SELECT * FROM users WHERE email = $1', [email])
        if (foundUser.rows.length) return res.status(400).send('Email already exists');

        if (!foundUser.rows.length) {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw new Error(err.message);
                bcrypt.hash(password, salt, async (err, hash) => {
                    if (err) throw new Error(err.message);

                    // If no errors, hash password and create new user
                    password = hash;
                    const newUser = await client.query(
                        `INSERT INTO users (role_id, first_name, last_name, email, password, phone, hourly_pay, started_at, updated_at)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                        [role_id, first_name, last_name, email, password, phone, hourly_pay, started_at, updated_at]
                    )

                    res.status(201).json({ success: true })
                })
            })
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await client.query(
            `SELECT * FROM users JOIN roles
                ON users.role_id = roles.role_id
            WHERE email = $1`,
            [email]
        );
        if (!user.rows.length) return res.status(400).send('Email does not exist');

        // Check if hashed password is a match
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) return res.status(400).send('Invalid credentials');

        // Generate token
        const payload = { id: user.rows[0].u_id };
        const token = jwt.sign(payload, process.env.JWT, { expiresIn: 60 * 60 * 24 });

        if (token) {
            // Remove password from response user obj
            delete user.rows[0].password;

            res.status(200).json({
                user: user.rows[0],
                token
            })
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Verify signed-in user on page load
exports.verifyUser = async (req, res) => {
    try {
        const user = await client.query(
            `SELECT * FROM users JOIN roles
                ON users.role_id = roles.role_id
            WHERE u_id = $1`,
            [req.id]
        );

        if (user.rows.length) {
            delete user.rows[0].password;

            res.status(200).json(user.rows[0]);
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}