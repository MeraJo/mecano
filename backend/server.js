console.log('Server v1 is starting...');

require('./db/init');
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const frontPath = path.join(__dirname, '..', 'front');

app.use(cors());
app.use(express.json());
app.use(express.static(frontPath));

// Import routes
const carsRouter = require('./routes/cars');
const problemsRouter = require('./routes/problems');
const solutionsRouter = require('./routes/solutions');
const carProblemsRouter = require('./routes/carProblems');
const searchRoutes = require('./routes/search')

// Use routes
app.use('/cars', carsRouter);
app.use('/problems', problemsRouter);
app.use('/solutions', solutionsRouter);
app.use('/car-problems', carProblemsRouter);
app.use('/search', searchRoutes);

// Frontend entry points
app.get('/', (req, res) => {
    res.sendFile(path.join(frontPath, 'car-repair-1.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(frontPath, 'admin.html'));
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});