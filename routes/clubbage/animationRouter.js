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

const animationRouter = express.Router();

animationRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.corsWithOptions, async (req, res, next) => {
        try {
            const [rows] = await connection.query(
                "SELECT animation_key, payload FROM animations ORDER BY id ASC"
            );

            const response = rows.reduce((acc, row) => {
                acc[row.animation_key] = row.payload;
                return acc;
            }, {});

            res.json(response);
        } catch (error) {
            next(error);
        }
    })
    .post(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /clubbageAnimation');
    })
    .put(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /clubbageAnimation');
    })
    .delete(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on /clubbageAnimation');
    });

animationRouter.route('/:animationKey')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.corsWithOptions, async (req, res, next) => {
        try {
            const { animationKey } = req.params;
            const [rows] = await connection.query(
                "SELECT animation_key, payload FROM animations WHERE animation_key = ? LIMIT 1",
                [animationKey]
            );

            if (!rows.length) {
                res.status(404).json({
                    error: `Animation '${animationKey}' was not found.`
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
        res.end(`POST operation not supported on /clubbageAnimation/${req.params.animationKey}`);
    })
    .put(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /clubbageAnimation/${req.params.animationKey}`);
    })
    .delete(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403;
        res.end(`DELETE operation not supported on /clubbageAnimation/${req.params.animationKey}`);
    });

module.exports = animationRouter;