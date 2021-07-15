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

exports.getAllShifts = async (req, res) => {
    try {
        const shifts = await client.query('SELECT * FROM shifts');

        res.status(200).json(shifts.rows);
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

exports.getShiftsByDate = async (req, res) => {
    try {
        const { start_date, end_date } = req.params;

        const data = await client.query(
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
                        's_id', s_id,
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

        let shifts = data.rows;

        let firstDate = new Date(start_date);
        let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        let dates = [];

        // Get dates for the week from Monday to Sunday
        for (let i = 0; i < 7; i++) {
            let day = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate() + i, 0).toLocaleString('en-US', { timeZone: timezone });
            dateToAdd = new Date(day).toISOString();
            dates.push({ 'shift_start': dateToAdd, 'shift_end': null });
        }

        // If an employee has no shifts for the week, add empty shifts
        for (let i = 0; i < shifts.length; i++) {
            if (!shifts[i].shifts.length) {
                for (let j = 0; j < 7; j++) {
                    shifts[i].shifts.push(dates[j]);
                }
            }
            else {
                // If an employee has at least one shift for the week,
                // Combine shifts and empty shifts for the week and sort by start_date
                let tempArr = [...shifts[i].shifts, ...dates];
                let sortedArr = tempArr.sort((a, b) => new Date(a.shift_start) - new Date(b.shift_start));

                // If there are matching dates, remove the one with start_end that is a NULL value
                for (let j = 0; j < sortedArr.length - 1; j++) {
                    for (let k = j + 1; k < sortedArr.length; k++) {
                        if (j === 0
                            && sortedArr[j].shift_start.split('T')[0] === sortedArr[k].shift_start.split('T')[0]
                            && sortedArr[j].shift_end === null) {
                            let one = sortedArr.slice(j + 1);
                            sortedArr = one;
                        }
                        else if (sortedArr[j].shift_start.split('T')[0] === sortedArr[k].shift_start.split('T')[0]
                            && sortedArr[j].shift_end === null) {
                            let one = sortedArr.slice(0, j);
                            let two = sortedArr.slice(j + 1);
                            sortedArr = [...one, ...two];
                        }
                        else if (sortedArr[j].shift_start.split('T')[0] === sortedArr[k].shift_start.split('T')[0]
                            && sortedArr[k].shift_end === null) {
                            let one = sortedArr.slice(0, k);
                            let two = sortedArr.slice(k + 1);
                            sortedArr = [...one, ...two];
                        }
                        else {
                            continue;
                        }
                    }
                }

                shifts[i].shifts = sortedArr;
            }
        }

        res.status(200).send(shifts);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.getAllUsersSchedulesByDate = async (req, res) => {
    const { start_date, end_date } = req.params;

    try {
        const data = await client.query(
            `WITH users AS (
                SELECT u_id, first_name, last_name, title, acn, level
                FROM roles JOIN users
                    ON roles.role_id = users.role_id
            ),
            availability AS (
                SELECT u_id, array[mon, tue, wed, thur, fri, sat, sun] AS availability
                FROM availability
                GROUP BY u_id, mon, tue, wed, thur, fri, sat, sun
            ),
            shifts AS (
                SELECT u.u_id,
                    CASE
                        WHEN COUNT(s) = 0
                            THEN ARRAY[]::json[]
                        ELSE
                            array_agg(s.shift)
                    END AS shifts
                FROM users as u
                LEFT JOIN
                    (
                        SELECT u_id, json_build_object(
                            's_id', s_id,
                            'shift_start', shift_start,
                            'shift_end', shift_end
                        ) AS shift
                        FROM shifts
                        WHERE shift_start::date >= $1
                            AND shift_start::date <= $2
                        ORDER BY shift_start
                    ) AS s
                    ON u.u_id = s.u_id
                GROUP BY u.u_id
            )
            SELECT u.u_id, u.first_name, u.last_name, u.title, u.acn, u.level, a.availability, s.shifts
            FROM users AS u
            JOIN availability AS a
                ON u.u_id = a.u_id
            JOIN shifts AS s
                ON a.u_id = s.u_id
            ORDER BY u.level, u.first_name`,
            [start_date, end_date]
        )

        let shifts = data.rows;

        let firstDate = new Date(start_date);
        let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        let dates = [];

        // Get dates for the week from Monday to Sunday
        for (let i = 0; i < 7; i++) {
            let day = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate() + i, 0).toLocaleString('en-US', { timeZone: timezone });
            dateToAdd = new Date(day).toISOString();
            dates.push({ 'shift_start': dateToAdd, 'shift_end': null });
        }

        // If an employee has no shifts for the week, add empty shifts
        for (let i = 0; i < shifts.length; i++) {
            if (!shifts[i].shifts.length) {
                for (let j = 0; j < 7; j++) {
                    shifts[i].shifts.push(dates[j]);
                }
            }
            else {
                // If an employee has at least one shift for the week,
                // Combine shifts and empty shifts for the week and sort by start_date
                let tempArr = [...shifts[i].shifts, ...dates];
                let sortedArr = tempArr.sort((a, b) => new Date(a.shift_start) - new Date(b.shift_start));

                // If there are matching dates, remove the one with start_end that is a NULL value
                for (let j = 0; j < sortedArr.length - 1; j++) {
                    for (let k = j + 1; k < sortedArr.length; k++) {
                        if (j === 0
                            && sortedArr[j].shift_start.split('T')[0] === sortedArr[k].shift_start.split('T')[0]
                            && sortedArr[j].shift_end === null) {
                            let one = sortedArr.slice(j + 1);
                            sortedArr = one;
                        }
                        else if (sortedArr[j].shift_start.split('T')[0] === sortedArr[k].shift_start.split('T')[0]
                            && sortedArr[j].shift_end === null) {
                            let one = sortedArr.slice(0, j);
                            let two = sortedArr.slice(j + 1);
                            sortedArr = [...one, ...two];
                        }
                        else if (sortedArr[j].shift_start.split('T')[0] === sortedArr[k].shift_start.split('T')[0]
                            && sortedArr[k].shift_end === null) {
                            let one = sortedArr.slice(0, k);
                            let two = sortedArr.slice(k + 1);
                            sortedArr = [...one, ...two];
                        }
                        else {
                            continue;
                        }
                    }
                }

                shifts[i].shifts = sortedArr;
            }
        }

        res.status(200).json(data.rows);

    } catch (err) {
        res.status(500).send(err.message);
    }
}