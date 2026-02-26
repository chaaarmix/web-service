const logs = [];

function loggingMiddleware(req, res, next) {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;

        // фильтруем /logs — их не добавляем
        if (!req.originalUrl.startsWith('/logs')) {
            const logEntry = `[${req.requestId}] ${req.method} ${req.originalUrl} -> ${res.statusCode}`;
            console.log(logEntry);
            logs.push(logEntry);
            const logTime = `[${req.requestId}] ${req.method} ${req.originalUrl} -> ${res.statusCode} took ${duration} ms`;

            console.log(logTime);
            logs.push(logTime);
            if (logs.length > 100) logs.shift();
        }
    });

    next();
}

function getLogs() {
    return logs;
}

module.exports = {
    loggingMiddleware,
    getLogs
};