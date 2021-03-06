const client = require('../config/db');

exports.createRequest = async (req, res) => {
    try {
        const { u_id, requested_at, notes, requested_dates } = req.body;

        const addRequest = await client.query(
            `INSERT INTO requests (u_id, requested_at, notes)
            VALUES ($1, $2, $3) RETURNING *`,
            [u_id, requested_at, notes]
        )

        // Add requested dates after creating request
        if (addRequest.rows) {
            for (let i = 0; i < requested_dates.length; i++) {
                const addRequestDays = await client.query(
                    `INSERT INTO request_days (r_id, requested_date)
                    VALUES ($1, $2)`,
                    [addRequest.rows[0].r_id, requested_dates[i]]
                )
            }
        }

        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.getRequestsByUser = async (req, res) => {
    try {
        const { u_id } = req.params;

        const requests = await client.query(
            `SELECT r.r_id, requested_at, notes, status,
                array_agg(rd.requested_date) AS requested_dates
            FROM users AS u
            JOIN requests AS r
                ON u.u_id = r.u_id
            JOIN
            (
                SELECT r_id, requested_date
                FROM request_days
                ORDER BY requested_date
            ) AS rd
            ON r.r_id = rd.r_id
            WHERE u.u_id = $1
            GROUP BY r.r_id, rd.r_id
            ORDER BY requested_at DESC`,
            [u_id]
        )

        res.status(200).send(requests.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.getAllRequests = async (req, res) => {
    try {
        const { date } = req.params;

        const requests = await client.query(
            `SELECT u.u_id, first_name, last_name, title, r.r_id, requested_at, notes, status,
                array_agg(rd.requested_date) AS requested_dates
            FROM roles JOIN users AS u
                ON roles.role_id = u.role_id
            JOIN requests AS r
                ON u.u_id = r.u_id
            JOIN
            (
                SELECT r_id, requested_date
                FROM request_days
                ORDER BY requested_date
            ) AS rd
            ON r.r_id = rd.r_id
            GROUP BY u.u_id, roles.title, first_name, last_name, r.r_id, rd.r_id
            ORDER BY requested_at DESC`
        );

        if (!requests.rows.length) return res.status(404).send('No records found');

        res.status(200).send(requests.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.getAllRequestsByStatus = async (req, res) => {
    try {
        const { status } = req.params;

        const requests = await client.query(
            `SELECT u.u_id, first_name, last_name, title, r.r_id, requested_at, notes, status,
                array_agg(rd.requested_date) AS requested_dates
            FROM roles JOIN users AS u
                ON roles.role_id = u.role_id
            JOIN requests AS r
                ON u.u_id = r.u_id
            JOIN
            (
                SELECT r_id, requested_date
                FROM request_days
                ORDER BY requested_date
            ) AS rd
            ON r.r_id = rd.r_id
            WHERE status = $1
            GROUP BY u.u_id, roles.title, first_name, last_name, r.r_id, rd.r_id
            ORDER BY requested_at DESC`,
            [status]
        );

        if (!requests.rows.length) return res.status(404).send('No records found');

        res.status(200).send(requests.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.getAllRequestsByStatusAndDate = async (req, res) => {
    try {
        const { status, weekStart, weekEnd } = req.params;

        const requests = await client.query(
            `WITH users AS (
                SELECT u.u_id, u.first_name, u.last_name, r.r_id, r.status
                FROM users AS u
                JOIN requests AS r
                   ON u.u_id = r.u_id
                WHERE r.status = $1
            ),
            requested_dates AS (
                SELECT r_id, requested_date
                FROM request_days
                WHERE requested_date::date >= $2
                AND requested_date::date <= $3
            )
            SELECT u.u_id, u.first_name, u.last_name,
                array_agg(rd.requested_date) AS requested_dates
            FROM users AS u
            JOIN requested_dates AS rd
                ON u.r_id = rd.r_id
            GROUP BY u.u_id, u.first_name, u.last_name`,
            [status, weekStart, weekEnd]
        )

        if (!requests.rows.length) return res.status(404).send('No records found');

        res.status(200).send(requests.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.deleteRequest = async (req, res) => {
    try {
        const { r_id } = req.params;

        // Delete dependent request days first
        const deleteRequestDay = await client.query('DELETE FROM request_days WHERE r_id = $1', [r_id]);
        // Then delete the request
        const deleteRequest = await client.query('DELETE FROM requests WHERE r_id = $1', [r_id]);

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.editRequestStatus = async (req, res) => {
    try {
        const { r_id } = req.params;
        const { status } = req.body;

        const editRequest = await client.query(
            `UPDATE requests
            SET status = $1
            WHERE r_id = $2`,
            [status, r_id]
        )

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}