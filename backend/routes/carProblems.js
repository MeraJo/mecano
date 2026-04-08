const express = require('express');
const router = express.Router();
const db = require('../db/database');

// LINK car to problem
router.post('/', (req, res) => {
    const { car_id, problem_id } = req.body;
    db.run(
        `INSERT INTO CarProblems (car_id, problem_id) VALUES (?, ?)`,
        [car_id, problem_id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Car linked to problem successfully', id: this.lastID });
        }
    );
});

// GET problems + solutions for a specific car
router.get('/:car_id', (req, res) => {
    const { car_id } = req.params;

    db.all(`
        SELECT 
            Problems.id AS problem_id,
            Problems.title AS problem_title,
            Problems.description AS problem_description,
            Solutions.id AS solution_id,
            Solutions.solution_text AS solution_text
        FROM CarProblems
        JOIN Problems ON CarProblems.problem_id = Problems.id
        LEFT JOIN Solutions ON Problems.id = Solutions.problem_id
        WHERE CarProblems.car_id = ?
    `, [car_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Group problems with their solutions
        const grouped = {};
        rows.forEach(row => {
            if (!grouped[row.problem_id]) {
                grouped[row.problem_id] = {
                    title: row.problem_title,
                    description: row.problem_description,
                    solutions: []
                }
            }
            if (row.solution_text) {
                grouped[row.problem_id].solutions.push(row.solution_text);
            }
        });

        res.json(Object.values(grouped));
    });
});

module.exports = router;