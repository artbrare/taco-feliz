const Usuario = require('../models/usuarios');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');


// GET: /api/v1/info-personal → Obtener la información del usuario actual de la sesión
exports.getInfoPersonal =  catchAsyncErrors( async (req, res, next) => {

    const usuario = await Usuario.findById(req.usuario.id);

    const token = usuario.getJwtToken();

    // damos 5 min más en la sesión de usuario
    res.cookie('token', token, {
        expires:  new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME *60*1000),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        data: usuario,
        token
    })
});


// UPDATE: /api/v1/password/ → Actualizar contraseña
exports.actualizarPassword =  catchAsyncErrors( async (req, res, next) => {

    const usuario = await Usuario.findById(req.usuario.id).select('+password');

    if(!(await usuario.comparePassword(req.body.currentPassword))){
        return next(new ErrorHandler('Contraseña inválida', 401));
    };

    usuario.password = req.body.newPassword;
    await usuario.save();

    sendToken(usuario, 200, res);
});

// UPDATE: /api/v1/info-personal/ → Actualizar datos del usuario actual
exports.actualizarDatosPersonales =  catchAsyncErrors( async (req, res, next) => {

    const nuevosDatosUsuario = {
        nombre: req.body.nombre,
        email: req.body.email
    }

    const usuario = await Usuario.findByIdAndUpdate(req.usuario.id, nuevosDatosUsuario, {
        new: true,
        runValidators: true,
    });

    const token = usuario.getJwtToken();

    // damos 5 min más en la sesión de usuario
    res.cookie('token', token, {
        expires:  new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME *60*1000),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        data: usuario,
        token
    });
});

// UPDATE: /api/v1/usuario/:idUsuario → Actualizar datos de cualquier usuario (solo el super admin) sirve para bloquear
exports.actualizarUsuario =  catchAsyncErrors( async (req, res, next) => {

    let usuario = await Usuario.findById(req.usuario.id);

    if(!usuario) {
        return next(new ErrorHandler("No se encontró ningún usuario.", 404));
    };

    const nuevosDatosUsuario = {
        bloqueado: req.body.bloqueado,
    }

    usuario = await Usuario.findByIdAndUpdate(usuario.id, nuevosDatosUsuario, {
        new: true,
        runValidators: true,
    });

    const token = usuario.getJwtToken();

    // damos 5 min más en la sesión de usuario
    res.cookie('token', token, {
        expires:  new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME *60*1000),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        data: usuario,
        token
    });
});