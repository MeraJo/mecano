console.log('Server v1 is starting...');

require('./db/init');
const express = require('express');
const app = express();

app.use(express.json());

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

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});