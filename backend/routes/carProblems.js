const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { tagsToArray, mergeTags } = require('../db/fieldHelpers');

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
            Cars.id AS car_id,
            Cars.brand AS car_brand,
            Cars.model AS car_model,
            Cars.tags AS car_tags,
            Problems.id AS problem_id,
            Problems.title AS problem_title,
            Problems.description AS problem_description,
            Problems.tags AS problem_tags,
            Solutions.id AS solution_id,
            Solutions.solution_title AS solution_title,
            Solutions.solution_text AS solution_body,
            Solutions.video_url AS video_url,
            Solutions.tags AS solution_tags
        FROM CarProblems
        JOIN Cars ON CarProblems.car_id = Cars.id
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
                    car_id: row.car_id,
                    car_brand: row.car_brand,
                    car_model: row.car_model,
                    title: row.problem_title,
                    description: row.problem_description,
                    solutions: [],
                    solution_ids: new Set(),
                    tags: mergeTags(tagsToArray(row.car_tags), tagsToArray(row.problem_tags))
                }
            }
            if (row.solution_id && !grouped[row.problem_id].solution_ids.has(row.solution_id)) {
                grouped[row.problem_id].solution_ids.add(row.solution_id);
                grouped[row.problem_id].solutions.push({
                    id: row.solution_id,
                    title: row.solution_title || 'حل',
                    body: row.solution_body || '',
                    video_url: row.video_url,
                    tags: tagsToArray(row.solution_tags)
                });
                grouped[row.problem_id].tags = mergeTags(
                    grouped[row.problem_id].tags,
                    tagsToArray(row.solution_tags)
                );
            }
        });

        res.json(Object.values(grouped).map((item) => ({
            car_id: item.car_id,
            car_brand: item.car_brand,
            car_model: item.car_model,
            title: item.title,
            description: item.description,
            solutions: item.solutions,
            tags: mergeTags(item.tags)
        })));
    });
});

module.exports = router;