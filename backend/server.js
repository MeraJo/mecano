console.log('Server v1 is starting...');

require('./db/init');
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const frontPath = path.join(__dirname, '..', 'front');
const { attachAuth, requireAdmin } = require('./middleware/auth');

function requireAdminForWrite(req, res, next) {
    if (req.method === 'GET') {
        return next();
    }
    return requireAdmin(req, res, next);
}

app.use(cors());
app.use(express.json());
app.use(attachAuth);

app.use((req, res, next) => {
    if (req.method === 'GET') {
        if (req.path === '/login.html' && req.admin?.role === 'admin') {
            return res.redirect('/admin');
        }

        if ((req.path === '/admin' || req.path === '/admin.html') && (!req.admin || req.admin.role !== 'admin')) {
            return res.redirect('/login.html');
        }
    }

    return next();
});

app.use(express.static(frontPath));

// Import routes
const carsRouter = require('./routes/cars');
const problemsRouter = require('./routes/problems');
const solutionsRouter = require('./routes/solutions');
const carProblemsRouter = require('./routes/carProblems');
const searchRoutes = require('./routes/search')
const authRoutes = require('./routes/auth');

// Use routes
app.use('/auth', authRoutes);
app.use('/cars', requireAdminForWrite, carsRouter);
app.use('/problems', requireAdminForWrite, problemsRouter);
app.use('/solutions', requireAdminForWrite, solutionsRouter);
app.use('/car-problems', requireAdminForWrite, carProblemsRouter);
app.use('/search', searchRoutes);

// Frontend entry points
app.get('/', (req, res) => {
    res.sendFile(path.join(frontPath, 'car-repair-1.html'));
});

app.get('/admin', (req, res) => {
    if (!req.admin || req.admin.role !== 'admin') {
        return res.redirect('/login.html');
    }
    res.sendFile(path.join(frontPath, 'admin.html'));
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});