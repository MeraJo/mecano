const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Create a new solution
router.post('/', (req, res) => {
    const { problem_id, solution_text } = req.body;
    db.run(
        `INSERT INTO Solutions (problem_id, solution_text) VALUES (?, ?)`,
        [problem_id, solution_text],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Solution created successfully', id: this.lastID });
        }
    );
});


// Get solutions for a specific problem
router.get('/:problem_id', (req, res) => {
    const { problem_id } = req.params;
    db.all(`SELECT * FROM Solutions WHERE problem_id = ?`, [problem_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Update a solution by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { solution_text } = req.body;
    db.run(
        `UPDATE Solutions SET solution_text = ? WHERE id = ?`,
        [solution_text, id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Solution updated successfully', changes: this.changes });
        }
    );
});

// Delete a solution by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM Solutions WHERE id = ?`, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Solution deleted successfully', changes: this.changes });
    });
});

module.exports = router;