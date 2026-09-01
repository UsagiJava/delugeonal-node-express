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
const corsDebugEnabled = process.env.CORS_DEBUG !== 'false';

const normalizeOrigin = (origin) => {
    if (!origin) {
        return origin;
    }

    return origin.endsWith('/') ? origin.slice(0, -1) : origin;
};

const evaluateOrigin = (origin) => {
    if (!origin) {
        return { allowed: true, reason: 'no-origin-header', normalizedOrigin: origin };
    }

    const normalizedOrigin = normalizeOrigin(origin);
    if (whitelist.includes(normalizedOrigin)) {
        return { allowed: true, reason: 'whitelist-match', normalizedOrigin };
    }

    try {
        const hostname = new URL(normalizedOrigin).hostname;
        if (hostname === 'delugeonal.com' || hostname.endsWith('.delugeonal.com')) {
            return { allowed: true, reason: 'domain-match', normalizedOrigin };
        }

        return { allowed: false, reason: 'domain-not-allowed', normalizedOrigin };
    } catch (error) {
        return { allowed: false, reason: 'invalid-origin-header', normalizedOrigin };
    }
};

const getClientIp = (req) => {
    const forwarded = req.header('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    return req.ip || req.socket?.remoteAddress || 'unknown';
};

const logCorsDecision = (req, origin, decision) => {
    if (!corsDebugEnabled) {
        return;
    }

    const message = [
        '[cors]',
        decision.allowed ? 'ALLOW' : 'BLOCK',
        `method=${req.method}`,
        `path=${req.originalUrl || req.url}`,
        `origin=${origin || 'none'}`,
        `normalizedOrigin=${decision.normalizedOrigin || 'none'}`,
        `reason=${decision.reason}`,
        `ip=${getClientIp(req)}`,
        `host=${req.header('host') || 'unknown'}`
    ].join(' ');

    console.log(message);
};

const corsResponseDebugLogger = (req, res, next) => {
    if (!corsDebugEnabled) {
        next();
        return;
    }

    const requestOrigin = req.header('Origin');
    const decision = evaluateOrigin(requestOrigin);

    // Non-CORS debug headers help diagnose proxies that strip Access-Control-* headers.
    res.setHeader('X-Cors-Debug-Allowed', decision.allowed ? 'true' : 'false');
    res.setHeader('X-Cors-Debug-Reason', decision.reason);
    res.setHeader('X-Cors-Debug-Origin', decision.normalizedOrigin || 'none');
    res.setHeader(
        'X-Cors-Debug-Acao-Expected',
        decision.allowed && decision.normalizedOrigin ? decision.normalizedOrigin : 'none'
    );

    if (!requestOrigin) {
        next();
        return;
    }

    res.on('finish', () => {
        const message = [
            '[cors:response]',
            `status=${res.statusCode}`,
            `method=${req.method}`,
            `path=${req.originalUrl || req.url}`,
            `origin=${requestOrigin}`,
            `acaOrigin=${res.getHeader('Access-Control-Allow-Origin') || 'none'}`,
            `vary=${res.getHeader('Vary') || 'none'}`,
            `ip=${getClientIp(req)}`
        ].join(' ');

        console.log(message);
    });

    next();
};

const corsActualHeaderDebugLogger = (req, res, next) => {
    if (!corsDebugEnabled) {
        next();
        return;
    }

    // Snapshot current ACAO after corsWithOptions has executed.
    res.setHeader(
        'X-Cors-Debug-Acao-Actual',
        String(res.getHeader('Access-Control-Allow-Origin') || 'none')
    );

    next();
};

const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    const requestOrigin = req.header('Origin');
    const decision = evaluateOrigin(requestOrigin);

    if (decision.allowed) {
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }

    logCorsDecision(req, requestOrigin, decision);

    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
exports.corsResponseDebugLogger = corsResponseDebugLogger;
exports.corsActualHeaderDebugLogger = corsActualHeaderDebugLogger;