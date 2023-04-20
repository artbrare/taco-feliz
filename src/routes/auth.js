const express = require('express');
const router = express.Router();

// Importar controladores
const {
    registrarUsuario,
    loginUsuario,
    logoutUsuario,
    forgotPassword,
    resetPassword,
} = require("../controllers/authController");

const { isAuthenticatedUser } = require('../middlewares/auth')

// Definir ruta para crear un usuario
router.route('/registrar').post(registrarUsuario);

// Definir ruta para logear un usuario
router.route('/login').post(loginUsuario);

// Definir ruta para logout un usuario
router.route('/logout').get(isAuthenticatedUser, logoutUsuario);

// Definir ruta para mandar email de recuperación,
router.route('/password/forgot').post(forgotPassword);

// Definir ruta para actualizar con token de recuperación,
router.route('/password/reset/:token').put(resetPassword);

module.exports = router;