const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { getClosestEmptyId, checkDuplicateId } = require('../db/idHelpers');
const { normalizeTagsInput, tagsToArray } = require('../db/fieldHelpers');

// Create a new car
router.post('/', (req, res) => {
    const { id, brand, model, engine_type, engine_size, year, tags } = req.body;

    const parsedId = id === undefined || id === null || id === '' ? null : Number(id);
    if (parsedId !== null && (!Number.isInteger(parsedId) || parsedId <= 0)) {
        return res.status(400).json({ error: 'ID must be a positive integer' });
    }

    const insertCar = (insertId = null) => {
        const query = insertId === null
            ? `INSERT INTO Cars (brand, model, engine_type, engine_size, year, tags) VALUES (?, ?, ?, ?, ?, ?)`
            : `INSERT INTO Cars (id, brand, model, engine_type, engine_size, year, tags) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const params = insertId === null
            ? [brand, model, engine_type, engine_size, year, normalizeTagsInput(tags)]
            : [insertId, brand, model, engine_type, engine_size, year, normalizeTagsInput(tags)];

        db.run(query, params, function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Car created successfully', id: insertId ?? this.lastID });
        });
    };

    if (parsedId === null) {
        return getClosestEmptyId(db, 'Cars', (idErr, suggestedId) => {
            if (idErr) {
                return res.status(500).json({ error: idErr.message });
            }

            return insertCar(suggestedId);
        });
    }

    checkDuplicateId(db, 'Cars', parsedId, (dupErr, exists) => {
        if (dupErr) {
            return res.status(500).json({ error: dupErr.message });
        }

        if (!exists) {
            return insertCar(parsedId);
        }

        getClosestEmptyId(db, 'Cars', (idErr, suggestedId) => {
            if (idErr) {
                return res.status(500).json({ error: idErr.message });
            }

            return res.status(409).json({
                error: `Car ID ${parsedId} already exists`,
                suggested_id: suggestedId,
                message: `Car ID ${parsedId} is taken. Suggested closest empty ID: ${suggestedId}`
            });
        });
    });
});

// Get all cars
router.get('/', (req, res) => {
    db.all(`SELECT * FROM Cars`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ cars: rows.map((row) => ({ ...row, tags: tagsToArray(row.tags) })) });
    });
});

// Read a specific car by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;

    db.get(`SELECT * FROM Cars WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(row ? { ...row, tags: tagsToArray(row.tags) } : row);
    });
});

// Update a car by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { brand, model, engine_type, engine_size, year, tags } = req.body;

    db.run(
        `UPDATE Cars SET brand = ?, model = ?, engine_type = ?, engine_size = ?, year = ?, tags = ? WHERE id = ?`,
        [brand, model, engine_type, engine_size, year, normalizeTagsInput(tags), id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Car updated successfully', changes: this.changes });
        }
    );
});

// Delete a car by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM Cars WHERE id = ?`, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Car deleted successfully', changes: this.changes });
    });
});

module.exports = router;


