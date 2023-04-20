const express = require('express');
const router = express.Router();

const {
    getInfoPersonal,
    actualizarPassword,
    actualizarDatosPersonales,
    actualizarUsuario
} = require('../controllers/usuarioController')

const {isAuthenticatedUser, authorizedRoles} = require('../middlewares/auth')

router.route('/info-personal')
    .get(isAuthenticatedUser, getInfoPersonal)
    .put(isAuthenticatedUser, actualizarDatosPersonales)

router.route('/password').put(isAuthenticatedUser, actualizarPassword);

router.route('/usuario/:idUsuario').put(isAuthenticatedUser, authorizedRoles('super admin'), actualizarUsuario)

module.exports = router