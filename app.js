const express = require('express');
const path = require('path');
require('dotenv').config();
const cors = require('./routes/cors');

const app = express();

// Middleware to automatically parse incoming JSON payloads
app.use(express.json());
app.use(cors.corsResponseDebugLogger);
app.use(cors.corsWithOptions);
app.use(cors.corsActualHeaderDebugLogger);
app.options(/.*/, cors.corsWithOptions);

const clubbageAnimationRouter = require('./routes/clubbage/animationRouter');
app.use('/clubbage/animation', clubbageAnimationRouter);

const clubbageCircuitRouter = require('./routes/clubbage/circuitRouter');
app.use('/clubbage/circuit', clubbageCircuitRouter);

const clubbagePlayerRouter = require('./routes/clubbage/playerRouter');
app.use('/clubbage/player', clubbagePlayerRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use((err, req, res, next) => {
    console.error('[api:error]', {
        method: req.method,
        path: req.originalUrl || req.url,
        message: err.message
    });

    if (res.headersSent) {
        next(err);
        return;
    }

    res.status(err.status || 500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// 404 Catch-all middleware
app.use((req, res, next) => {
    res.status(404).send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found - 404</title>
    <style>
        body { font-family: sans-serif; text-align: center; padding: 50px; background-color: #f7f7f7; }
        h1 { font-size: 50px; color: #333; }
        p { font-size: 20px; color: #666; }
        a { color: #007bff; text-decoration: none; }
    </style>
</head>
<body>
    <h1>404</h1>
    <p>Oops! The page you are looking for does not exist.</p>
    <p><a href="/">Return to Home Page</a></p>
</body>
</html>`);
});

module.exports = app;
