const client = require('../config/db');

// Admins only
exports.createShift = async (req, res) => {
    try {
        const { u_id, shift_start, shift_end } = req.body;

        const shift = await client.query(
            `INSERT INTO shifts (u_id, shift_start, shift_end)
            VALUES ($1, $2, $3)`,
            [u_id, shift_start, shift_end]
        )

        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Admins only
exports.editShift = async (req, res) => {
    try {
        const { s_id } = req.params;
        const { u_id, shift_start, shift_end } = req.body;

        const shift = await client.query(
            `UPDATE shifts
            SET u_id = $1,
                shift_start = $2,
                shift_end = $3
            WHERE s_id = $4`,
            [u_id, shift_start, shift_end, s_id]
        )

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Admins only
exports.deleteShift = async (req, res) => {
    try {
        const { s_id } = req.params;

        const foundShift = await client.query('SELECT * FROM shifts WHERE s_id = $1', [s_id]);
        if (!foundShift.rows.length) return res.status(404).send('Record does not exist');

        const deletedShift = await client.query('DELETE FROM shifts WHERE s_id = $1', [s_id]);

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.getShiftsByUser = async (req, res) => {
    try {
        const { u_id, shift_start, shift_end } = req.params;

        const shifts = await client.query(
            `SELECT * FROM shifts
            WHERE shift_start >= $1
                AND shift_end <= $2
                AND u_id = $3
            ORDER BY shift_start`,
            [shift_start, shift_end, u_id]
        )

        if (!shifts.rows.length) return res.status(404).send('No records found');

        res.status(200).json(shifts.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Admins only
exports.getShiftsByWeek = async (req, res) => {
    try {
        const { shift_start, shift_end } = req.params;

        const shifts = await client.query(
            `SELECT * FROM shifts
            WHERE shift_start >= $1
                AND shift_end <= $2
            ORDER BY shift_start`,
            [shift_start, shift_end]
        )

        if (!shifts.rows.length) return res.status(404).send('No records found');

        res.status(200).json(shifts.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}