const db = require('./database');

db.serialize(() => {

    // Create Cars table
    db.run(`
        CREATE TABLE IF NOT EXISTS Cars (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            brand TEXT NOT NULL,
            model TEXT NOT NULL,
            engine_type TEXT,
            engine_size REAL,
            year INTEGER
        )
    `);

    // Create Problems and Solutions tables

    db.run(`
        CREATE TABLE IF NOT EXISTS Problems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Solutions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            problem_id INTEGER,
            solution_text TEXT,
            FOREIGN KEY (problem_id) REFERENCES Problems(id)
        )
    `);

    //link tables for many to many relationship between cars and problems
    db.run(`
        CREATE TABLE IF NOT EXISTS CarProblems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            car_id INTEGER,
            problem_id INTEGER,
            FOREIGN KEY (car_id) REFERENCES Cars(id),
            FOREIGN KEY (problem_id) REFERENCES Problems(id)
        )
    `);

    console.log('Tables created or already exist');
});