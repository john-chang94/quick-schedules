const client = require('../config/db');

exports.getRoles = async (req, res) => {
    try {
        const roles = await client.query('SELECT * FROM roles');

        res.status(200).json(roles.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.createRole = async (req, res) => {
    try {
        const { title } = req.body;
        const role = await client.query('INSERT INTO roles (title) VALUES ($1)', [title])

        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}