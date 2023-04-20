const express = require("express");
const router = express.Router();

// Importar controladores de platillos
const {
    crearPlatillo,
    actualizarPlatillo,
    obtenerPlatillos,
    obtenerPlatillo,
    eliminarPlatillo,
    crearModificador,
    actualizarModificador,
    obtenerModificadores,
    obtenerModificador,
    eliminarModificador
} = require("../controllers/platillosController");

const { isAuthenticatedUser, authorizedRoles } = require('../middlewares/auth')

// Definir ruta para crear un platillo y obtener todos los platillos
router.route("/platillo")
    .post(isAuthenticatedUser, authorizedRoles("super admin"), crearPlatillo)
    .get(isAuthenticatedUser, obtenerPlatillos);

// Definir ruta para actualizar, obtener y eliminar un platillo por su id
router.route('/platillo/:idPlatillo')
    .put(isAuthenticatedUser, authorizedRoles("super admin"), actualizarPlatillo)
    .get(isAuthenticatedUser, obtenerPlatillo)
    .delete(isAuthenticatedUser, authorizedRoles("super admin"), eliminarPlatillo);

// Definir ruta para crear un modificador y obtener todos los modificadores de un platillo
router.route('/platillo/:idPlatillo/modificador')
    .post(isAuthenticatedUser, authorizedRoles("super admin"), crearModificador)
    .get(isAuthenticatedUser, obtenerModificadores);

// Definir ruta para actualizar, obtener y eliminar un modificador por su id de un platillo en especifico
router.route('/platillo/:idPlatillo/modificador/:idModificador')
    .put(isAuthenticatedUser,  authorizedRoles("super admin"), actualizarModificador)
    .get(isAuthenticatedUser, obtenerModificador)
    .delete(isAuthenticatedUser, authorizedRoles("super admin"), eliminarModificador);

module.exports = router;