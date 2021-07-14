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

exports.getShiftsByDates = async (req, res) => {
    try {
        const { start_date, end_date } = req.params;

        const result = await client.query(
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

        let shifts = result.rows;
        // console.log(`shifts`, shifts)

        let date = new Date();
        let firstDate = new Date(start_date);
        let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        let dates = [];
        for (let i = 0; i < 7; i++) {
            let day = new Date(date.getFullYear(), date.getMonth(), firstDate.getDate() + i, 0).toLocaleString('en-US', { timeZone: timezone });
            day2 = new Date(day).toISOString()
            dates.push({ 'shift_start': day2, 'shift_end': null });
        }
        // console.log(`dates`, dates)
        // console.log(new Date(dates[0].shift_start).toJSON().split('T')[0])
        // console.log(new Date(shifts[1].shifts[0].shift_start).toJSON())

        // for (let i = 0; i < dates.length; i++) {
        for (let j = 0; j < shifts.length; j++) {
            let index = 0;
            if (!shifts[j].shifts.length) {
                // console.log(`empty`, shifts[j].shifts.length)
                for (let k = 0; k < 7; k++) {
                    // if (shifts[j].shifts[index] === undefined || new Date(dates[index]).toLocaleDateString() !== new Date(shifts[j].shifts[index].shift_start).toLocaleDateString()) {
                    shifts[j].shifts.push(dates[index])
                    // }
                    index++;
                }
            }
            else {
                let datesArr = [];
                let missingDates = [];
                // for (let k = 0; k < shifts[j].shifts.length; k++) {
                // for (let i = 0; i < dates.length; i++) {
                let tempArr = [...shifts[j].shifts, ...dates];
                let sortedArr = tempArr.sort((a, b) => new Date(a.shift_start) - new Date(b.shift_start))

                for (let i = 0; i < sortedArr.length - 1; i++) {
                    // console.log(`sortedArr`, sortedArr)
                    // console.log('check', new Date(sortedArr[i].shift_start).toJSON().split('T')[0] === new Date(sortedArr[j+1].shift_start).toJSON().split('T')[0])
                    for (let mm = i + 1; mm < sortedArr.length; mm++) {
                        // console.log(`i`, i)
                        // console.log(`mm`, mm)
                        if (i === 0 && sortedArr[i].shift_start.split('T')[0] === sortedArr[mm].shift_start.split('T')[0]
                            && sortedArr[i].shift_end === null) {
                            let one = sortedArr.slice(i + 1);
                            sortedArr = one;
                            // console.log(' ')
                            // console.log(`sortedArr1`, sortedArr)
                        }
                        else if ((sortedArr[i].shift_start.split('T')[0] === sortedArr[mm].shift_start.split('T')[0] && sortedArr[i].shift_end === null)) {
                            // console.log('I', sortedArr[i].shift_start.split('T')[0])
                            // console.log('m', sortedArr[mm].shift_start.split('T')[0])
                            let one = sortedArr.slice(0, i);
                            let two = sortedArr.slice(i + 1);
                            sortedArr = [...one, ...two];
                            // console.log(' ')
                            // console.log(`sortedArr2`, sortedArr)
                        }
                        else if ((sortedArr[i].shift_start.split('T')[0] === sortedArr[mm].shift_start.split('T')[0] && sortedArr[mm].shift_end === null)) {
                            // console.log('I', sortedArr[i].shift_start)
                            // console.log('m', sortedArr[mm].shift_start)
                            let one = sortedArr.slice(0, mm);
                            let two = sortedArr.slice(mm + 1);
                            sortedArr = [...one, ...two];
                            // console.log(' ')
                            // console.log(`sortedArr3`, sortedArr)
                        }
                        else {
                            continue;
                        }
                    }
                }
                shifts[j].shifts = sortedArr;
                // console.log(`sortedArr`, sortedArr)
                //             if (new Date(dates[index]).toJSON().split('T')[0] !== shifts[j].shifts[k].shift_start.split('T')[0]) {
                //                 // for (let l = 0; l < shifts[j].shifts.length; l++) {
                //                 //     if (new Date(dates[index]).toJSON().split('T')[0] === shifts[j].shifts[l].shift_start.split('T')[0]) {
                //                 //         console.log(`match`)
                //                 //         continue;
                //                 //     } else {
                //                         datesArr.push({ 'shift_start': dates[index] })

                //                 //     }
                //                 // }
                //                 // console.log(`${shifts[j].u_id}`)
                //                 // console.log(new Date(dates[index]).toLocaleDateString())
                //                 // console.log(new Date(shifts[j].shifts[k].shift_start).toDateString())
                //                 // console.log(date)
                //             }
                //         // }
                //         // console.log(`j`, j)
                //         // console.log(`k`, k)
                //         // let date = shifts[j].shifts[k].shift_start.split('T')[0]
                //         index++;
                //     // }
                //     let finalArr = [...shifts[j].shifts, ...datesArr]
                //     shifts[j].shifts = finalArr.sort((a, b) => new Date(a.shift_start) - new Date(b.shift_start));

            }
            // else {
            //     continue;
            // }

        }
        // }
        // console.log((new Date(dates[0].shift_start).split('T')[0]))
        // console.log((shifts[1].shifts[0].shift_start.split('T')[0]))
        // console.log(new Date(dates[0]).toJSON().split('T')[0] !== shifts[1].shifts[0].shift_start.split('T')[0])
        // if (new Date(dates[4]).toLocaleDateString() !== new Date(shifts[0].shifts[0]).toLocaleDateString()) {
        //     shifts[0].shifts.push({ 'shift_start': dates[6] })
        // }

        res.status(200).send(shifts);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.getDatesForNullShifts = async (req, res) => {
    const { start_date } = req.params;

    let date = new Date();
    let firstDate = new Date(start_date);
    let dates = [];
    for (let i = 0; i < 7; i++) {
        let day = new Date(date.setDate(firstDate.getDate() + i));
        dates.push(day);
    }

    res.send(dates);
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

        res.status(200).json(data.rows);

    } catch (err) {
        res.status(500).send(err.message);
    }
}