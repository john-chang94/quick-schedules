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

exports.updateRole = async (req, res) => {
    try {
        const { role_id } = req.params;
        const { title } = req.body;

        const updatedRole = await client.query(
            `UPDATE roles
                SET title = $1
            WHERE role_id = $2
            RETURNING *`,
            [title, role_id]
        )

        return res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

exports.deleteRole = async (req, res) => {
    try {
        const { role_id } = req.params;
        
        const deletedRole = await client.query('DELETE FROM roles WHERE role_id = $1', [role_id]);

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
}