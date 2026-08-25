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

const normalizeOrigin = (origin) => {
    if (!origin) {
        return origin;
    }

    return origin.endsWith('/') ? origin.slice(0, -1) : origin;
};

const isAllowedOrigin = (origin) => {
    if (!origin) {
        return true;
    }

    const normalizedOrigin = normalizeOrigin(origin);
    if (whitelist.includes(normalizedOrigin)) {
        return true;
    }

    try {
        const hostname = new URL(normalizedOrigin).hostname;
        return hostname === 'delugeonal.com' || hostname.endsWith('.delugeonal.com');
    } catch (error) {
        return false;
    }
};

const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    const requestOrigin = req.header('Origin');

    if (isAllowedOrigin(requestOrigin)) {
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }

    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);