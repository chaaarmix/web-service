const crypto = require('crypto');

function requestIdMiddleware(req, res, next) {
    const requestId = crypto.randomUUID();

    req.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);

    next();
}

module.exports = requestIdMiddleware;