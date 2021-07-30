const client = require('../config/db');
const bcrypt = require('bcrypt');

// Need to fix between dates
exports.getAllUsers = async (req, res) => {
    try {
        const users = await client.query(
            `SELECT u_id, title, acn, level, first_name, last_name, email, phone
            FROM roles JOIN users
                ON roles.role_id = users.role_id
            ORDER BY level, first_name`
        );

        if (!users.rows.length) return res.status(400).send('No users found');

        res.status(200).json(users.rows)
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.getUserById = async (req, res) => {
    try {
        const { u_id } = req.params;

        const user = await client.query(
            `SELECT *, hourly_pay::money FROM roles JOIN users
                ON roles.role_id = users.role_id
            WHERE u_id = $1`,
            [u_id]);

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

exports.editUserSystem = async (req, res) => {
    try {
        const { u_id } = req.params;
        const { role_id, hourly_pay, started_at, updated_at } = req.body;

        const user = await client.query(
            `UPDATE users
                SET role_id = $1,
                hourly_pay = $2,
                started_at = $3,
                updated_at = $4
            WHERE u_id = $5`,
            [role_id, hourly_pay, started_at, updated_at, u_id]
        )

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { u_id } = req.params;

        const foundUser = await client.query('SELECT * FROM users WHERE u_id = $1', [u_id]);
        if (!foundUser.rows.length) return res.status(404).send('User does not exist');

        const deletedUser = await client.query('DELETE FROM users WHERE u_id = $1', [u_id]);

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.addAdvailability = async (req, res) => {
    try {
        const { u_id, mon, tue, wed, thur, fri, sat, sun } = req.body;

        const availability = await client.query(
            `INSERT INTO availability (u_id, mon, tue, wed, thur, fri, sat, sun)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [u_id, mon, tue, wed, thur, fri, sat, sun]
        )

        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.editAvailability = async (req, res) => {
    try {
        const { u_id } = req.params;
        const { mon, tue, wed, thur, fri, sat, sun, updated_at } = req.body;

        const availability = await client.query(
            `UPDATE availability
                SET mon = $1,
                tue = $2,
                wed = $3,
                thur = $4,
                fri = $5,
                sat = $6,
                sun = $7,
                updated_at = $8
            WHERE u_id = $9`,
            [mon, tue, wed, thur, fri, sat, sun, updated_at, u_id]
        )

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// exports.addAdvailability2 = async (req, res) => {
//     try {
        
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// }

exports.getUserAvailability = async (req, res) => {
    try {
        const { u_id } = req.params;

        const availability = await client.query(
            `SELECT json_build_array(
                json_build_object(
                    'day', 'Monday',
                    'time', mon
                ),
                json_build_object(
                    'day', 'Tuesday',
                    'time', tue
                ),
                json_build_object(
                    'day', 'Wednesday',
                    'time', wed
                ),
                json_build_object(
                    'day', 'Thursday',
                    'time', thur
                ),
                json_build_object(
                    'day', 'Friday',
                    'time', fri
                ),
                json_build_object(
                    'day', 'Saturday',
                    'time', sat
                ),
                json_build_object(
                    'day', 'Sunday',
                    'time', sun
                )
            ) AS avail
            FROM availability
            WHERE u_id = $1`,
            [u_id]
            )

        res.status(200).send(availability.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.editAvailabilityNotes = async (req, res) => {
    try {
        const { u_id } = req.params;
        const { notes } = req.body;

        const addNotes = await client.query(
            `UPDATE availability
                SET notes = $1,
            WHERE u_id = $2`,
            [u_id, notes]
        )

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Get users and their availability
exports.getAllUsersAndAvailability = async (req, res) => {
    try {
        const result = await client.query(
            `WITH users AS (
                SELECT u_id, first_name, last_name, title, acn, level
                FROM roles JOIN users
                    ON roles.role_id = users.role_id
            ),
            availability AS (
                SELECT u_id, array[mon, tue, wed, thur, fri, sat, sun] AS availability
                FROM availability
                GROUP BY u_id, mon, tue, wed, thur, fri, sat, sun
            )
            SELECT u.u_id, u.first_name, u.last_name, u.title, u.acn, u.level, a.availability
            FROM users AS u JOIN availability AS a
                ON u.u_id = a.u_id
            ORDER BY u.level, u.first_name`
        )

        res.status(200).json(result.rows);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

// Need to fix between dates
exports.getUserAvailabilityAndRequests = async (req, res) => {
    try {
        const { u_id, week_start, week_end } = req.params;

        const result = await client.query(
            `WITH availability AS (
                SELECT users.u_id, first_name, last_name, acn, mon, tue, wed, thur, fri, sat, sun
                FROM roles JOIN users
                    ON roles.role_id = users.role_id
                JOIN availability
                    ON users.u_id = availability.u_id
                WHERE users.u_id = $1
            ),
            requests AS (
                SELECT requests.u_id, array_agg(requested_date) AS requested_dates
                FROM requests JOIN request_days
                    ON requests.r_id = request_days.r_id
                WHERE requests.u_id = $1
                    AND requested_date >= $2
                    AND requested_date <= $3
                GROUP BY requests.u_id
            )
            SELECT a.first_name, a.last_name, a.acn, a.mon, a.tue, a.wed, a.thur,
                a.fri, a.sat, a.sun, r.requested_dates
            FROM availability AS a LEFT JOIN requests AS r
                ON a.u_id = r.u_id`,
            [u_id, week_start, week_end]
        )

        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
}