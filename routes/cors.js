const cors = require('cors');

const defaultWhitelist = [
    'http://localhost:3000',
    'https://localhost:3443',
    'https://delugeonal.com',
    'https://www.delugeonal.com'
];

const envWhitelist = (process.env.CORS_WHITELIST || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const whitelist = [...new Set([...defaultWhitelist, ...envWhitelist])];

const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    const requestOrigin = req.header('Origin');

    if (!requestOrigin || whitelist.includes(requestOrigin)) {
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }

    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);