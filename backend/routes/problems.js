const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Create a new problem
router.post('/', (req, res) => {
    const { title, description } = req.body;

    db.run(
        `INSERT INTO Problems (title, description) VALUES (?, ?)`,
        [title, description],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Problem created successfully', id: this.lastID });
        }
    );
});

// Get all problems
router.get('/', (req, res) => {
    db.all(`SELECT * FROM Problems`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Read a specific problem by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM Problems WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(row);
    });
});

// Update a problem by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    db.run(
        `UPDATE Problems SET title = ?, description = ? WHERE id = ?`,
        [title, description, id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Problem updated successfully', changes: this.changes });
        }
    );
});

// Delete a problem by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM Problems WHERE id = ?`, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Problem deleted successfully', changes: this.changes });
    });
});

module.exports = router;