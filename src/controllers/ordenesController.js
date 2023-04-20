const Platillo = require('../models/platillos');
const Orden = require('../models/ordenes');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFilters = require('../utils/apiFilters');
const moment = require("moment-timezone");
const sendEmail = require('../utils/sendEmail');

// Validar si la hora actual es mayor o igual a las 10am y menor o igual a las 6pm en horario de México
function validarHorario() {
    const horaActual = moment.tz("America/Mexico_City").format("HH:mm:ss");
    const horaLimiteInferior = "10:00:00";
    const horaLimiteSuperior = "18:00:00";

    return horaActual >= horaLimiteInferior && horaActual <= horaLimiteSuperior;
}

// POST: /api/v1/orden/ → Crea una orden
exports.crearOrden = catchAsyncErrors(async (req, res, next) => {

    const { platillos, propina, metodoPago } = req.body;

    // Validar que la orden está dentro de horario
    if (!validarHorario()) {
        return next(new ErrorHandler("Horario fuera de servicio.", 400));
    };

    // Validar que se envíen al menos un platillo válido
    if (!platillos || platillos.length === 0) {
        return next(new ErrorHandler("La orden debe tener al menos un platillo.", 400));
    }

    // Validar la disponibilidad de los platillos y sus modificadores y calcular el total de la orden
    let total = 0

    for (const platillo of platillos) {
        const platilloDB = await Platillo.findById(platillo._id);
        if (!platilloDB || platilloDB.eliminado || !platilloDB.disponible) {
            return next(new ErrorHandler("Uno o más platillos o modificadores no están disponibles.", 400));
        };
        platillo.nombre = platilloDB.nombre;
        platillo.precio = platilloDB.precio;
        total += platillo.cantidad * platillo.precio;

        for (const modificador of platillo.modificadores) {
            const modificadorDB = platilloDB.modificadores.id(modificador._id);
            if (!modificadorDB || modificadorDB.eliminado || !modificadorDB.disponible) {
                return next(new ErrorHandler("Uno o más platillos o modificadores no están disponibles.", 400));
            };
            modificador.nombre = modificadorDB.nombre;
            modificador.precio = modificadorDB.precio;
            total += modificador.precio * platillo.cantidad;
        };
    };

    // agregamos propina
    total *= (1 + propina)

    const orden_completa = {
        platillos,
        propina,
        metodoPago,
        total: parseFloat(total.toFixed(2)),
        estatus: 'preparando',
        usuario: req.usuario.id,
    };

    // Se crea un nuevo platillo en la base de datos
    const orden = await Orden.create(orden_completa);

    // 5 min después, si el estatus sigue siendo "preparando", pasa a ser entregado
    setTimeout(async () => {
        const ordenActualizada = await Orden.findById(orden._id);
        if (ordenActualizada.estatus === "preparando") {
            ordenActualizada.estatus = "entregado";
            await ordenActualizada.save();
        }
    }, 5 * 60 * 1000); // 5 minutos en milisegundos

    // se manda correo con la orden:

    try {
        let orden_string = `ID de la orden: ${orden._id}\n`;
        orden_string += `Fecha de la orden: ${moment.tz("America/Mexico_City").format("DD/MM/YYYY, HH:mm")}\n`;

        for (const platillo of orden_completa.platillos) {
            orden_string += `${platillo.nombre} x ${platillo.cantidad}\nPrecio unitario: ${platillo.precio}\n`;

            if (platillo.modificadores.length > 0) {
                orden_string += "Modificadores:\n";
                for (const modificador of platillo.modificadores) {
                    orden_string += `${modificador.nombre}: ${modificador.precio}\n`;
                }
            }

            orden_string += "\n";
        }

        orden_string += `Propina: ${orden_completa.propina}\nTotal: ${orden_completa.total}`;
        await sendEmail({
            email: req.usuario.email,
            subject: 'Taco Feliz - Orden creada',
            message: orden_string

        });
    } catch (error) {
        console.log(error);
    }

    const token = req.usuario.getJwtToken();

    // damos 5 min más en la sesión de usuario
    res.cookie('token', token, {
        expires:  new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME *60*1000),
        httpOnly: true
    })

    return res.status(200).json({
        success: true,
        message: 'Orden creado exitosamente.',
        data: orden,
        token
    });
});

// PUT: /api/v1/orden/owner/:idOrden → Actualiza una orden desde el usuario que la creo
exports.actualizarOrdenOwner = catchAsyncErrors(async (req, res, next) => {

    const idOrden = req.params.idOrden;

    // el metodo de pago no se puede cambiar
    let { platillos, propina, estatus } = req.body;

    let orden = await Orden.findById(idOrden);

    if (orden.estatus !== "preparando") {
        return next(new ErrorHandler(`Una orden con estatus: ${orden.estatus} no se puede modificar`), 400);
    }

    if (orden.usuario.toString() !== req.usuario.id) {
        return next(new ErrorHandler(`No se puede modificar una orden que no es propia.`), 400);
    };

    if (estatus === "entregado") {
        return next(new ErrorHandler(`No se puede cambiar el estatus a entregado.`), 400);
    }

    let total = 0;
    if (platillos && platillos.length > 0) {
        for (const platillo of platillos) {
            const platilloDB = await Platillo.findById(platillo._id);
            if (!platilloDB || platilloDB.eliminado || !platilloDB.disponible) {
                return next(new ErrorHandler("Uno o más platillos o modificadores no están disponibles.", 400));
            };

            platillo.nombre = platilloDB.nombre;
            platillo.precio = platilloDB.precio;
            total += platillo.cantidad * platillo.precio;

            for (const modificador of platillo.modificadores) {
                const modificadorDB = platilloDB.modificadores.id(modificador._id);
                if (!modificadorDB || modificadorDB.eliminado || !modificadorDB.disponible) {
                    return next(new ErrorHandler("Uno o más platillos o modificadores no están disponibles.", 400));
                };
                modificador.nombre = modificadorDB.nombre;
                modificador.precio = modificadorDB.precio;
                total += platillo.cantidad * modificador.precio;
            };
        };
    } else {
        platillos = orden.platillos
        total = orden.total / (1 + orden.propina)
    }
    propina = propina || orden.propina

    total *= (1 + propina)

    const orden_completa = {
        platillos,
        propina,
        total: parseFloat(total.toFixed(2)),
        estatus,
    };

    orden = await Orden.findByIdAndUpdate(req.params.idOrden, orden_completa, {
        new: true,
        runValidators: true,
    });

    const token = req.usuario.getJwtToken();

    // damos 5 min más en la sesión de usuario
    res.cookie('token', token, {
        expires:  new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME *60*1000),
        httpOnly: true
    })

    return res.status(200).json({
        success: true,
        message: 'Orden actualizada exitosamente.',
        data: orden,
        token
    });
});

// PUT: /api/v1/orden/admin/:idOrden → Actualiza una orden desde el restaurante
exports.actualizarOrdenAdmin = catchAsyncErrors(async (req, res, next) => {

    const idOrden = req.params.idOrden;
    const { estatus } = req.body;

    let orden = await Orden.findById(idOrden);

    if (orden.estatus !== "preparando") {
        return next(new ErrorHandler(`Una orden con estatus: ${orden.estatus} no se puede modificar`), 400);
    }

    orden = await Orden.findByIdAndUpdate(req.params.idOrden, { estatus }, {
        new: true,
        runValidators: true,
    });

    const token = req.usuario.getJwtToken();

    // damos 5 min más en la sesión de usuario
    res.cookie('token', token, {
        expires:  new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME *60*1000),
        httpOnly: true
    })

    return res.status(200).json({
        success: true,
        message: 'Orden actualizada exitosamente.',
        data: orden,
        token
    });
});

