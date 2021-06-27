const client = require('../config/db');

exports.addStoreHours = async (req, res) => {
    try {
        const { store_open, store_close } = req.body;

        const storeHours = await client.query(
            `INSERT INTO store (store_open, store_close)
            VALUES ($1, $2)`,
            [store_open, store_close]
        )

        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.editStoreHours = async (req, res) => {
    try {
        const { store_open, store_close } = req.body;

        const storeHours = await client.query(
            `UPDATE store
            SET store_open = $1, store_close = $2`,
            [store_open, store_close]
        )

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}