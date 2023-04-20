const express = require("express");
const router = express.Router();

// Importar controladores de ordenes
const {
    crearOrden,
    actualizarOrdenOwner,
    actualizarOrdenAdmin
} = require("../controllers/ordenesController");

const { isAuthenticatedUser, authorizedRoles } = require('../middlewares/auth')

// Definir ruta para crear una orden y obtener todas las ordenes
router.route("/orden")
    .post(isAuthenticatedUser, crearOrden)

// Definir ruta para que el usuario pueda editar su orden
router.route("/orden/owner/:idOrden").put(isAuthenticatedUser, actualizarOrdenOwner)

// Definir ruta para que el restaurante pueda cambiar el estatus de una orden
router.route("/orden/admin/:idOrden").put(isAuthenticatedUser, authorizedRoles('super admin'), actualizarOrdenAdmin)

module.exports = router;