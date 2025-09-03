const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erro inesperado';
    const errors = err.errors || [];

    res.status(statusCode).json({
        status: statusCode,
        message,
        errors,
    });
};

module.exports = errorHandler;
