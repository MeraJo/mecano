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
            year INTEGER,
            tags TEXT
        )
    `);

    // Create Problems and Solutions tables

    db.run(`
        CREATE TABLE IF NOT EXISTS Problems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            tags TEXT,
            danger_level TEXT DEFAULT 'medium'
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Solutions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            problem_id INTEGER,
            solution_title TEXT,
            solution_text TEXT,
            video_url TEXT,
            tags TEXT,
            FOREIGN KEY (problem_id) REFERENCES Problems(id)
        )
    `);

    const tablesToCheck = [
        { table: 'Cars', column: 'tags' },
        { table: 'Problems', column: 'tags' },
        { table: 'Problems', column: 'danger_level' },
        { table: 'Solutions', column: 'solution_title' },
        { table: 'Solutions', column: 'tags' },
        { table: 'Solutions', column: 'video_url' }
    ];

    tablesToCheck.forEach(({ table, column }) => {
        db.all(`PRAGMA table_info(${table})`, [], (schemaErr, columns) => {
            if (schemaErr) {
                console.error(`Failed to read ${table} schema:`, schemaErr.message);
                return;
            }

            const hasColumn = columns.some((item) => item.name === column);
            if (!hasColumn) {
                db.run(`ALTER TABLE ${table} ADD COLUMN ${column} TEXT`, (alterErr) => {
                    if (alterErr) {
                        console.error(`Failed to add ${table}.${column} column:`, alterErr.message);
                    } else {
                        console.log(`${table}.${column} column added`);
                    }
                });
            }
        });
    });

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