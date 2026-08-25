const express = require('express');
const cors = require('../cors');
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const circuitRouter = express.Router();

circuitRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.corsWithOptions, async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT id, name, email FROM circuits');
            res.status(200).json({ success: true, data: rows });
        } catch (error) {
            res.status(500).json({ success: false, error: 'GET operation failed to retrieve circuit data.' });
        }
    })
    .post(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /clubbageCircuit');
    })
    .put(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /clubbageCircuit');
    })
    .delete(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on /clubbageCircuit');
    });

circuitRouter.route('/:circuitId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.corsWithOptions, async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT id, name, email FROM circuits WHERE id = ?', [req.params.circuitId]);
            res.status(200).json({ success: true, data: rows });
        } catch (error) {
            res.status(500).json({ success: false, error: 'GET operation failed to retrieve circuit data.' });
        }
    })
    .post(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /clubbageCircuit/${req.params.circuitId}`);
    })
    .put(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /clubbageCircuit/${req.params.circuitId}`);
    })
    .delete(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403;
        res.end(`DELETE operation not supported on /clubbageCircuit/${req.params.circuitId}`);
    });

module.exports = circuitRouter;