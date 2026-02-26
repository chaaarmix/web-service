function errorMiddleware(err, req, res, next) {
    console.error(`[${req.requestId}]`, err.message);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        errorCode: err.code || 'InternalError',
        message: err.message || 'Unexpected error',
        requestId: req.requestId
    });
}

module.exports = errorMiddleware;