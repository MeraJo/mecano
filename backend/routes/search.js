const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { tagsToArray, mergeTags } = require('../db/fieldHelpers');

router.post('/', (req, res) => {
    const { brand, model, engine_type, engine_size, year } = req.body;

    if (!brand || !engine_type || engine_size === undefined || engine_size === null) {
        return res.status(400).json({ error: 'brand, engine_type and engine_size are required' });
    }

    const conditions = [
        'Cars.brand = ?',
        'Cars.engine_type = ?',
        'Cars.engine_size = ?'
    ];
    const params = [brand, engine_type, Number(engine_size)];

    if (model) {
        conditions.push('Cars.model = ?');
        params.push(model);
    }

    if (year !== undefined && year !== null && year !== '') {
        conditions.push('Cars.year = ?');
        params.push(Number(year));
    }

    const query = `
        SELECT 
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
        FROM Cars
        JOIN CarProblems ON Cars.id = CarProblems.car_id
        JOIN Problems ON problems.id = CarProblems.problem_id
        LEFT JOIN Solutions ON solutions.problem_id = Problems.id
        WHERE ${conditions.join(' AND ')}
    `;

    db.all(query, params, (err, rows) => {
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
                    solutions: [],
                    solution_ids: new Set(),
                    video_url: null,
                    tags: mergeTags(tagsToArray(row.car_tags), tagsToArray(row.problem_tags))
                };
            }

            if (row.solution_id && !grouped[row.problem_id].solution_ids.has(row.solution_id)) {
                grouped[row.problem_id].solution_ids.add(row.solution_id);
                grouped[row.problem_id].solutions.push({
                    title: row.solution_title || 'حل',
                    body: row.solution_body || ''
                });
            }

            if (!grouped[row.problem_id].video_url && row.video_url) {
                grouped[row.problem_id].video_url = row.video_url;
            }

            grouped[row.problem_id].tags = mergeTags(
                grouped[row.problem_id].tags,
                tagsToArray(row.solution_tags)
            );
        });

        const normalized = Object.values(grouped).map((problem) => ({
            title: problem.title,
            description: problem.description,
            solution_text: problem.solutions
                .map((solution) => `${solution.title}\n${solution.body}`.trim())
                .join('\n\n'),
            video_url: problem.video_url,
            tags: problem.tags
        }));

        res.json(normalized);

    });
});

module.exports = router;