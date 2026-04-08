const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.post('/', (req, res) => {
    const { brand, model, engine_type, engine_size, year } = req.body;

    const query = `
        SELECT 
            Problems.id AS problem_id,
            Problems.title AS problem_title,
            Problems.description AS problem_description,
            Solutions.solution_text AS solution_text
        FROM Cars
        JOIN CarProblems ON Cars.id = CarProblems.car_id
        JOIN Problems ON problems.id = CarProblems.problem_id
        LEFT JOIN Solutions ON solutions.problem_id = Problems.id
        WHERE Cars.brand = ? 
        AND Cars.model = ?
        AND Cars.engine_type = ?
        AND Cars.engine_size = ?
        AND Cars.year = ?
    `;

    db.all(query, [brand, model, engine_type, engine_size, year], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No problems found for the specified car' });
        }

        // group solutions under each problem

        const grouped = {};

        rows.forEach(row => {
            if(!grouped[row.problem_id]) {
                grouped[row.problem_id] = {
                    title: row.problem_title,
                    description: row.problem_description,
                    solutions: []
                };
            }

            if (row.solution_text) {
                grouped[row.problem_id].solutions.push(row.solution_text);
            }
        });

        res.json(Object.values(grouped));

    });
});

module.exports = router;