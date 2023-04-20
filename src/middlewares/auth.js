const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils//errorHandler');

// Revisamos si el usuario está autenticado
exports.isAuthenticatedUser =  catchAsyncErrors( async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    };

    if(!token) {
        return next(new ErrorHandler('Inicia sesión para acceder a este recurso.'),400)
    };

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = await Usuario.findById(decoded.id);

    if(req.usuario.bloqueado) {
        return next(new ErrorHandler('Usuario bloqueado.'),400)
    }

    next();
});

// Revisamos el rol de usuario
exports.authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.usuario.rol)) {
            return next(new ErrorHandler("El usuario actual no tiene acceso a este recurso."), 400)
        };
        next();
    };
};

// Revisamos si el usuario no está bloqueado
exports.isNotBlocked = () => {
    return (req, res, next) => {
        console.log(req.usuario)
        if(req.usuario.bloqueado) {
            return next(new ErrorHandler("El usuario está bloqueado."), 400)
        };
        next();
    };
};