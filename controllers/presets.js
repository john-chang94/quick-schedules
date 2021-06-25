const client = require('../config/db');

exports.createPreset = async (req, res) => {
    try {
        const { shift_start, shift_end, shift_start_value, shift_end_value, level } = req.body;

        const preset = await client.query(
            `INSERT INTO presets (shift_start, shift_end, shift_start_value, shift_end_value, level)
            VALUES ($1, $2, $3, $4, $5)`,
            [shift_start, shift_end, shift_start_value, shift_end_value, level]
        )

        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.deletePreset = async (req, res) => {
    try {
        const { p_id } = req.params;

        const foundPreset = await client.query('SELECT * FROM presets WHERE p_id = $1', [p_id]);
        if (!foundPreset.rows.length) return res.status(404).send('Record does not exist');

        const deletedPreset = await client.query('DELETE FROM presets WHERE p_id = $1', [p_id]);

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}