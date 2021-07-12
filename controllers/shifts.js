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
        const { u_id, shift_start, shift_end, notes } = req.body;

        const shift = await client.query(
            `UPDATE shifts
            SET u_id = $1,
                shift_start = $2,
                shift_end = $3,
                notes = $4
            WHERE s_id = $5`,
            [u_id, shift_start, shift_end, notes, s_id]
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

exports.getShiftsByDates = async (req, res) => {
    try {
        const { start_date, end_date } = req.params;

        const shifts = await client.query(
            `SELECT u.u_id, first_name, last_name,
                CASE
                    WHEN COUNT(s) = 0
                        THEN ARRAY[]::json[]
                    ELSE
                        array_agg(s.shift)
                END AS shifts
            FROM roles AS r JOIN users AS u
                ON r.role_id = u.role_id
            LEFT JOIN
                (
                    SELECT u_id, json_build_object(
                        'shift_start', shift_start,
                        'shift_end', shift_end
                    ) AS shift
                    FROM shifts
                    WHERE shift_start::date >= $1
                        AND shift_start::date <= $2
                    ORDER BY shift_start DESC
                ) AS s
                ON u.u_id = s.u_id
            GROUP BY u.u_id, r.level, first_name, last_name
            ORDER BY r.level, first_name`,
            [start_date, end_date]
        )

        res.status(200).json(shifts.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}