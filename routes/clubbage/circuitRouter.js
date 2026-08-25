const express = require('express');
const cors = require('../cors');
const mysql = require('mysql2/promise');
const connection = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || '3306'),
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
    .get(cors.corsWithOptions, async (req, res, next) => {
        try {
            const [rows] = await connection.query(
                "SELECT circuit_key, payload FROM circuits ORDER BY CAST(circuit_key AS UNSIGNED), id ASC"
            );

            const response = rows.map((row) => row.payload);
            res.json(response);
        } catch (error) {
            next(error);
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

circuitRouter.route('/:circuitKey')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.corsWithOptions, async (req, res, next) => {
        try {
            const { circuitKey } = req.params;
            const [rows] = await connection.query(
                "SELECT circuit_key, payload FROM circuits WHERE circuit_key = ? LIMIT 1",
                [circuitKey]
            );

            if (!rows.length) {
                res.status(404).json({
                    error: `Circuit '${circuitKey}' was not found.`
                });
                return;
            }

            res.json(rows[0].payload);
        } catch (error) {
            next(error);
        }
    })
    .post(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /clubbageCircuit/${req.params.circuitKey}`);
    })
    .put(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /clubbageCircuit/${req.params.circuitKey}`);
    })
    .delete(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403;
        res.end(`DELETE operation not supported on /clubbageCircuit/${req.params.circuitKey}`);
    });

module.exports = circuitRouter;