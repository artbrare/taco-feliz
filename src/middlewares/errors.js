const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {

    // Se establece el código del error o por defecto 500
    err.statusCode = err.statusCode || 500;

    // Si el entorno es desarrollo, se envía la respuesta con el mensaje y un stack de errores
    if(process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack,
        });
    };

    // si el entorno es producción, se manejan los errores según su tipo
    if(process.env.NODE_ENV === 'production ') {

        let error = {...err};
        error.message = err.message;

        // Se maneja el error por ID inválido de Mongoose
        if(err.name === 'CastError') {
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new ErrorHandler(message, 404);
        };

        // Se manejan errores de validación de Mongoose
        if(err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 400);
        };

        // Se maneja errores de duplicación de keys de Mongoose
        if(err.code === 11000) {
            const message = `${Object.keys(err.keyValue)} duplicado.`;
            error: new ErrorHandler(message, 400);
        }

        // manejando error de wrong JWT token
        if(err.name === 'JsonWebTokenError') {
            const message = 'JSON web token es inválido. Inténtalo de nuevo.'
            error = new ErrorHandler(message, 500);
        }

        // manejando error de token expirado
        if(err.name === 'TokenExpiredError') {
            const message = 'JSON web token expirado. Inténtalo de nuevo.'
            error = new ErrorHandler(message, 500);
        }

        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error.'
        });
    };
};