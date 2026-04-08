const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Create a new car
router.post('/', (req, res) => {
    const { brand, model, engine_type, engine_size, year } = req.body;

    db.run(
        `INSERT INTO Cars (brand, model, engine_type, engine_size, year) VALUES (?, ?, ?, ?, ?)`,
        [brand, model, engine_type, engine_size, year],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Car created successfully', id: this.lastID });
        }
    );
});

// Get all cars
router.get('/', (req, res) => {
    db.all(`SELECT * FROM Cars`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ cars: rows });
    });
});

// Read a specific car by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;

    db.get(`SELECT * FROM Cars WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(row);
    });
});

// Update a car by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { brand, model, engine_type, engine_size, year } = req.body;

    db.run(
        `UPDATE Cars SET brand = ?, model = ?, engine_type = ?, engine_size = ?, year = ? WHERE id = ?`,
        [brand, model, engine_type, engine_size, year, id],
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


