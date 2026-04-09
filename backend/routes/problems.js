const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { getClosestEmptyId, checkDuplicateId } = require('../db/idHelpers');
const { normalizeTagsInput, tagsToArray } = require('../db/fieldHelpers');

// Create a new problem
router.post('/', (req, res) => {
    const { id, title, description, tags } = req.body;

    const parsedId = id === undefined || id === null || id === '' ? null : Number(id);
    if (parsedId !== null && (!Number.isInteger(parsedId) || parsedId <= 0)) {
        return res.status(400).json({ error: 'ID must be a positive integer' });
    }

    const insertProblem = (insertId = null) => {
        const query = insertId === null
            ? `INSERT INTO Problems (title, description, tags) VALUES (?, ?, ?)`
            : `INSERT INTO Problems (id, title, description, tags) VALUES (?, ?, ?, ?)`;

        const params = insertId === null
            ? [title, description, normalizeTagsInput(tags)]
            : [insertId, title, description, normalizeTagsInput(tags)];

        db.run(query, params, function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Problem created successfully', id: insertId ?? this.lastID });
        });
    };

    if (parsedId === null) {
        return getClosestEmptyId(db, 'Problems', (idErr, suggestedId) => {
            if (idErr) {
                return res.status(500).json({ error: idErr.message });
            }

            return insertProblem(suggestedId);
        });
    }

    checkDuplicateId(db, 'Problems', parsedId, (dupErr, exists) => {
        if (dupErr) {
            return res.status(500).json({ error: dupErr.message });
        }

        if (!exists) {
            return insertProblem(parsedId);
        }

        getClosestEmptyId(db, 'Problems', (idErr, suggestedId) => {
            if (idErr) {
                return res.status(500).json({ error: idErr.message });
            }

            return res.status(409).json({
                error: `Problem ID ${parsedId} already exists`,
                suggested_id: suggestedId,
                message: `Problem ID ${parsedId} is taken. Suggested closest empty ID: ${suggestedId}`
            });
        });
    });
});

// Get all problems
router.get('/', (req, res) => {
    db.all(`SELECT * FROM Problems`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows.map((row) => ({ ...row, tags: tagsToArray(row.tags) })));
    });
});

// Read a specific problem by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM Problems WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(row ? { ...row, tags: tagsToArray(row.tags) } : row);
    });
});

// Update a problem by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, tags } = req.body;
    db.run(
        `UPDATE Problems SET title = ?, description = ?, tags = ? WHERE id = ?`,
        [title, description, normalizeTagsInput(tags), id],
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