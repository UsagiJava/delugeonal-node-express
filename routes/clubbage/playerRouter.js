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
const playerRouter = express.Router();

playerRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.corsWithOptions, async (req, res, next) => {
        try {
            const [rows] = await connection.query(
                "SELECT player_key, payload FROM players ORDER BY id ASC"
            );

            const response = rows.reduce((acc, row) => {
                acc[row.player_key] = row.payload;
                return acc;
            }, {});

            res.json(response);
        } catch (error) {
            next(error);
        }
    })
    .post(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /clubbagePlayer');
    })
    .put(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /clubbagePlayer');
    })
    .delete(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on /clubbagePlayer');
    });

playerRouter.route('/:playerKey')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.corsWithOptions, async (req, res) => {
        try {
            const { playerKey } = req.params;
            const [rows] = await connection.query(
                "SELECT player_key, payload FROM players WHERE player_key = ? LIMIT 1",
                [playerKey]
            );

            if (!rows.length) {
                res.status(404).json({
                    error: `Player '${playerKey}' was not found.`
                });
                return;
            }

            res.json(rows[0].payload);
        } catch (error) {
            res.status(500).json({ success: false, error: 'GET operation failed to retrieve player data.' });
        }
    })
    .post(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /clubbagePlayer/${req.params.playerKey}`);
    })
    .put(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /clubbagePlayer/${req.params.playerKey}`);
    })
    .delete(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403;
        res.end(`DELETE operation not supported on /clubbagePlayer/${req.params.playerKey}`);
    });

module.exports = playerRouter;