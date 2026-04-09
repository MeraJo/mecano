const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { getClosestEmptyId, checkDuplicateId } = require('../db/idHelpers');
const { normalizeTagsInput, tagsToArray } = require('../db/fieldHelpers');

// Create a new solution
router.post('/', (req, res) => {
    const { id, problem_id, solution_title, solution_body, solution_text, video_url, tags } = req.body;

    const parsedId = id === undefined || id === null || id === '' ? null : Number(id);
    if (parsedId !== null && (!Number.isInteger(parsedId) || parsedId <= 0)) {
        return res.status(400).json({ error: 'ID must be a positive integer' });
    }

    const insertSolution = (insertId = null) => {
        const body = solution_body ?? solution_text ?? '';
        const query = insertId === null
            ? `INSERT INTO Solutions (problem_id, solution_title, solution_text, video_url, tags) VALUES (?, ?, ?, ?, ?)`
            : `INSERT INTO Solutions (id, problem_id, solution_title, solution_text, video_url, tags) VALUES (?, ?, ?, ?, ?, ?)`;

        const params = insertId === null
            ? [problem_id, solution_title || null, body, video_url || null, normalizeTagsInput(tags)]
            : [insertId, problem_id, solution_title || null, body, video_url || null, normalizeTagsInput(tags)];

        db.run(query, params, function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Solution created successfully', id: insertId ?? this.lastID });
        });
    };

    if (parsedId === null) {
        return getClosestEmptyId(db, 'Solutions', (idErr, suggestedId) => {
            if (idErr) {
                return res.status(500).json({ error: idErr.message });
            }

            return insertSolution(suggestedId);
        });
    }

    checkDuplicateId(db, 'Solutions', parsedId, (dupErr, exists) => {
        if (dupErr) {
            return res.status(500).json({ error: dupErr.message });
        }

        if (!exists) {
            return insertSolution(parsedId);
        }

        getClosestEmptyId(db, 'Solutions', (idErr, suggestedId) => {
            if (idErr) {
                return res.status(500).json({ error: idErr.message });
            }

            return res.status(409).json({
                error: `Solution ID ${parsedId} already exists`,
                suggested_id: suggestedId,
                message: `Solution ID ${parsedId} is taken. Suggested closest empty ID: ${suggestedId}`
            });
        });
    });
});


// Get all solutions
router.get('/', (req, res) => {
    db.all(`SELECT id, problem_id, solution_title, solution_text AS solution_body, video_url, tags FROM Solutions`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows.map((row) => ({ ...row, tags: tagsToArray(row.tags) })));
    });
});

// Get solutions for a specific problem
router.get('/:problem_id', (req, res) => {
    const { problem_id } = req.params;
    db.all(`SELECT id, problem_id, solution_title, solution_text AS solution_body, video_url, tags FROM Solutions WHERE problem_id = ?`, [problem_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows.map((row) => ({ ...row, tags: tagsToArray(row.tags) })));
    });
});

// Update a solution by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { solution_title, solution_body, solution_text, video_url, tags } = req.body;
    const body = solution_body ?? solution_text ?? '';
    db.run(
        `UPDATE Solutions SET solution_title = ?, solution_text = ?, video_url = ?, tags = ? WHERE id = ?`,
        [solution_title || null, body, video_url || null, normalizeTagsInput(tags), id],
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