const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'Por favor ingresa tu nombre']
    },
    email: {
        type: String,
        required: [true, 'Por favor ingresa tu dirección de correo electrónico'],
        validate: [validator.isEmail, 'Por favor ingresa una dirección de correo electrónico válida'],
        unique: true
    },
    rol: {
        type: String,
        enum: {
            values: ['usuario', 'super admin'],
            message: 'Por favor selecciona un rol correcto'
        },
        default: 'usuario'
    },
    password: {
        type: String,
        required: [true, 'Por favor ingresa una contraseña para tu contraseña'],
        minlength: [8, 'Tu contraseña debe ser de al menos 8 caracteres'],
        select: false
    },
    bloqueado: {
        type: Boolean,
        required: true,
        default: false,
      },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

// encriptando contraseñas antes de salvar
usuarioSchema.pre('save', async function(next) {

    if(!this.isModified('password')){
        next();
    }

    this.password = await bcrypt.hash(this.password, 10)
    next();
})

// return JSON Web Token
usuarioSchema.methods.getJwtToken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
};

// comparamos contraseña de usuario con la contraseña en la base de datos
usuarioSchema.methods.comparePassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
};

// Password reset token
usuarioSchema.methods.getResetPasswordToken = function() {
    // Generar token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // hash
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // expiring time
    this.resetPasswordExpire = Date.now() + 30*60*1000;

    return resetToken;
};


module.exports = mongoose.model('Usuario', usuarioSchema)