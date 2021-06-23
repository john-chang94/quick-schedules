const client = require('../config/db');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await client.query('SELECT * FROM users');

        if (!users.rows.length) return res.status(400).send('No users found');

        res.status(200).json(users.rows)
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.getUserById = async (req, res) => {
    try {
        const { u_id } = req.params;

        const user = await client.query('SELECT * FROM users WHERE u_id = $1', [u_id]);

        if (!user.rows.length) return res.status(400).send('No user found');

        res.status(200).json(user.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.editUserGeneral = async (req, res) => {
    try {
        const { u_id } = req.params;
        const { first_name, last_name, email, phone } = req.body;

        const updatedUser = await client.query(
            `UPDATE users
                SET first_name = $1,
                last_name = $2,
                email = $3,
                phone = $4
            WHERE u_id = $5`,
            [first_name, last_name, email, phone, u_id]
        )

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.editUserPassword = async (req, res) => {
    try {
        const { u_id } = req.params;
        let { password, new_password, confirm_new_password } = req.body;

        const user = await client.query('SELECT * FROM users WHERE u_id = $1', [u_id]);

        // Validate user's current password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) return res.status(400).send('Incorrect password');

        // Check if new password and confirmation password match
        const newPasswordMatch = new_password === confirm_new_password;
        if (!newPasswordMatch) return res.status(400).send('New passwords do not match');

        // Hash new password and update db
        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw new Error(err.message);

            bcrypt.hash(new_password, salt, async (err, hash) => {
                if (err) throw new Error(err.message);

                new_password = hash;

                const newUserPass = await client.query(
                    `UPDATE users SET password = $1
                    WHERE u_id = $2`,
                    [new_password, u_id]
                )

                res.status(200).json({ success: true });
            })
        })
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Only admins can change this info
exports.editUserSystem = async (req, res) => {
    try {
        const { u_id } = req.params;
        const { role_id, hourly_pay, started_at } = req.body;

        const user = await client.query(
            `UPDATE users
                SET role_id = $1,
                hourly_pay = $2,
                started_at = $3
            WHERE u_id = $4`,
            [role_id, hourly_pay, started_at, u_id]
        )

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}