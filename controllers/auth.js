const client = require('../config/db');
const bcrypt = require('bcrypt');

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
