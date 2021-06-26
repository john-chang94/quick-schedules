const client = require('../config/db');

exports.createRequest = async (req, res) => {
    try {
        const { u_id, requested_at, notes } = req.body;

        const addRequest = await client.query(
            `INSERT INTO requests (u_id, requested_at, notes)
            VALUES ($1, $2, $3) RETURNING *`,
            [u_id, requested_at, notes]
        )

        res.status(201).json({ r_id: addRequest.rows[0].r_id });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Run after createRequest with the returned r_id
exports.addRequestDays = async (req, res) => {
    try {
        const { u_id, r_id, date } = req.body;

        const addRequestDays = await client.query(
            `INSERT INTO request_days (u_id, r_id, date)
            VALUES ($1, $2, $3)`,
            [u_id, r_id, date]
        )

        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Get requests by current date and later
exports.getRequestsByDateAndLater = async (req, res) => {
    try {
        const { currentDate, status } = req.params;

        // Get requests by status
        if (currentDate && status) {
            const requests = await client.query(
                `SELECT * FROM requests
                WHERE date >= $1 AND status = $2`,
                [currentDate, status]
            )

            if (!requests.rows.length) return res.status(404).send('No records found');

            res.status(200).send(requests.rows);
        }
        else 
        {
            // Get all requests
            const requests = await client.query('SELECT * FROM requests WHERE date >= $1', [currentDate]);

            if (!requests.rows.length) return res.status(404).send('No records found');

            res.status(200).send(requests.rows);
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Run after dependent request days are deleted first
exports.deleteRequest = async (req, res) => {
    try {
        const { r_id } = req.params;

        const deleteRequest = await client.query('DELETE FROM requests WHERE r_id = $1', [r_id]);

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.deleteRequestDays = async (req, res) => {
    try {
        const { r_id } = req.params;

        const foundRequestDay = await client.query('SELECT * FROM request_days WHERE r_id = $1', [r_id]);
        if (!foundRequestDay.rows.length) return res.status(404).send('No records found');

        const deleteRequestDay = await client.query('DELETE FROM request_days WHERE r_id = $1', [r_id]);

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Admins only
exports.editRequestStatus = async (req, res) => {
    try {
        const { r_id } = req.params;
        const { status } = req.body;

        const editRequest = await client.query(
            `UPDATE requests
            SET status = $1,
            WHERE r_id = $2`,
            [status, r_id]
        )

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}