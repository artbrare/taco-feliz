const Usuario = require('../models/usuarios');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const enviarToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');


// POST: /api/v1/registrar → Crea un usuario nuevo
exports.registrarUsuario = catchAsyncErrors(async (req, res, next) => {

    const { nombre, email, password, rol } = req.body;

    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        rol
    });

    enviarToken(usuario, 200, res)
});

// POST: /api/v1/login → Login de usuario
exports.loginUsuario = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Validamos si email o user no fueron ingresados
    if (!email || !password) {
        return next(new ErrorHandler('Por favor ingresa email y contraseña'), 400)
    }

    // Buscando usuario en la base de datos
    const usuario = await Usuario.findOne({ email }).select('+password');

    if (!usuario) {
        return next(new ErrorHandler('Usuario o contraseña inválido'), 401)
    };

    if (usuario.bloqueado) {
        return next(new ErrorHandler('Usuario bloqueado'), 401)
    };


    // Validando si la contraseña es correcta
    if (!(await usuario.comparePassword(password))) {
        return next(new ErrorHandler('Contraseña inválida', 401));
    };

    enviarToken(usuario, 200, res)
});

// POST: /api/v1/logout → Logout de usuario
exports.logoutUsuario = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    return res.status(200).json({
        success: true,
        message: 'Sesión cerrada exitósamente'
    });
});

// POST: /api/v1/password/forgot → Ruta para enviar correo de recuperación de contraseña
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const usuario = await Usuario.findOne({ email: req.body.email });

    // Revisar si el email está en la base de datos
    if (!usuario || usuario.bloqueado) {
        return next(new ErrorHandler('No hay usuario con este email o el usuario está bloqueado'));
    };

    // Obtener reset token
    const resetToken = usuario.getResetPasswordToken();

    await usuario.save({ validateBeforeSave: false });

    // Create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Link de recuperación: \n\n ${resetUrl} \n\n Si no solicitaste cambiar tu contraseña, 
    por favor ignora este correo.`;

    try {
        await sendEmail({
            email: usuario.email,
            subject: 'Taco Feliz - Email de recuperación de contraseña',
            message
        });

        res.status(200).json({
            success: true,
            message: 'Email sent successfully'
        });
    } catch (error) {
        usuario.resetPasswordToken = undefined;
        usuario.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(ErrorHandler('Email no enviado.'), 500);
    }
});

// POST: /api/v1/password/reset/:token → Ruta para resetear contraseña
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // Hash url token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const usuario = await Usuario.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt : Date.now()}
    })

    if(!usuario || usuario.bloqueado) {
        return next(new ErrorHandler('Token es inválido, ha expirado o el usuario está bloqueado'), 400);
    }

    usuario.password = req.body.password;
    usuario.resetPasswordToken = undefined;
    usuario.resetPasswordExpire = undefined;

    await usuario.save();

    enviarToken(usuario, 200, res);
});