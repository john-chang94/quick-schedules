const client = require('../config/db');

exports.getStoreHours = async (req, res) => {
    try {
        const storeHours = await client.query('SELECT * FROM store');

        if (!storeHours.rows) return res.status(404).json('No records found');

        res.status(200).send(storeHours.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.addStoreHours = async (req, res) => {
    try {
        const { store_open, store_close, store_open_value, store_close_value, store_open_level, store_close_level } = req.body;

        const storeHours = await client.query(
            `INSERT INTO store (store_open, store_close, store_open_value, store_close_value, store_open_level, store_close_level)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [store_open, store_close, store_open_value, store_close_value, store_open_level, store_close_level]
        )

        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.editStoreHours = async (req, res) => {
    try {
        const { store_open, store_close, store_open_value, store_close_value, store_open_level, store_close_level } = req.body;

        const storeHours = await client.query(
            `UPDATE store
            SET store_open = $1,
            store_close = $2,
            store_open_value = $3,
            store_close_value = $4,
            store_open_level = $5,
            store_close_level = $6`,
            [store_open, store_close, store_open_value, store_close_value, store_open_level, store_close_level]
        )

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Get pre-built available time slots
exports.getTimes = async (req, res) => {
    try {
        const times = await client.query('SELECT * FROM times');

        res.status(200).json(times.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}