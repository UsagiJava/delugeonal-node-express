import express from 'express';
import 'dotenv/config';

const app = express();

// Middleware to automatically parse incoming JSON payloads
app.use(express.json());

const clubbageAnimationRouter = require('./routes/clubbageAnimation');
app.use('/api/clubbageAnimation', clubbageAnimationRouter);

const clubbageCircuitRouter = require('./routes/clubbageCircuit');
app.use('/api/clubbageCircuit', clubbageCircuitRouter);

const clubbagePlayerRouter = require('./routes/clubbagePlayer');
app.use('/api/clubbagePlayer', clubbagePlayerRouter);

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

// Dynamically bind to the port assigned
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    //console.log(`Server running on port ${PORT}`);
});
