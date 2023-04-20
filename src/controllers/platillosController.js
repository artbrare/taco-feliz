const Platillo = require('../models/platillos');
const Usuario = require('../models/usuarios')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFilters = require('../utils/apiFilters');


// POST: /api/v1/platillo/ → Crea un platillo
exports.crearPlatillo = catchAsyncErrors(async (req, res, next) => {

    // Validar el cuerpo de la solicitud
    if (req.body.eliminado) {
        return next(new ErrorHandler("No se permite establecer 'eliminado' en la solicitud.", 400));
    }

    // Se crea un nuevo platillo en la base de datos
    const platillo = await Platillo.create(req.body);

    const token = req.usuario.getJwtToken();

    // damos 5 min más en la sesión de usuario
    res.cookie('token', token, {
        expires:  new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME *60*1000),
        httpOnly: true
    })

    return res.status(200).json({
        success: true,
        message: 'Platillo creado exitosamente.',
        data: platillo,
        token
    });
});

// PUT: /api/v1/platillo/:idPlatillo → Actualiza información de un platillo existente
exports.actualizarPlatillo = catchAsyncErrors(async (req, res, next) => {

    // Validar el cuerpo de la solicitud
    if (req.body.eliminado) {
        return next(new ErrorHandler("No se permite establecer 'eliminado' en la solicitud.", 400));
    };

    let platillo = await Platillo.findById(req.params.idPlatillo);

    if (!platillo || platillo.eliminado) {
        return next(new ErrorHandler("No se encontró el platillo en la base de datos.", 404));
    };

    platillo = await Platillo.findByIdAndUpdate(req.params.idPlatillo, req.body, {
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
        message: 'Platillo actualizado exitosamente.',
        data: platillo,
        token
    });
});

// GET: /api/v1/platillo/ → Obtiene una lista de platillos (menu)
exports.obtenerPlatillos = catchAsyncErrors(async (req, res, next) => {

    const apiFilters = new APIFilters(Platillo.find({ eliminado: false }), req.query)
        .filter()
        .sort()
        .limitFields()
        .pagination();
    const platillos = await apiFilters.query // Encuentra los platillos no eliminados

    const token = req.usuario.getJwtToken();
    
    // damos 5 min más en la sesión de usuario
    res.cookie('token', token, {
        expires:  new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME *60*1000),
        httpOnly: true
    })

    return res.status(200).json({
        success: true,
        results: platillos.length,
        data: platillos,
        token
    });
});

// GET: /api/v1/platillo/:idPlatillo → Obtiene información de un solo Platillo
exports.obtenerPlatillo = catchAsyncErrors(async (req, res, next) => {

    // Verificar que el platillo existe o no esté eliminado
    const platillo = await Platillo.findById(req.params.idPlatillo);
    if (!platillo || platillo.eliminado) {
        return next(new ErrorHandler("No se encontró el Platillo en la base de datos.", 404));
    };

    const token = req.usuario.getJwtToken();

    // damos 5 min más en la sesión de usuario
    res.cookie('token', token, {
        expires:  new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME *60*1000),
        httpOnly: true
    })

    return res.status(200).json({
        success: true,
        data: platillo,
        token
    });
});

// DELETE: /api/v1/platillo/:idPlatillo → Borra un Platillo
exports.eliminarPlatillo = catchAsyncErrors(async (req, res, next) => {

    // Verificar que el platillo existe o no esté eliminado
    let platillo = await Platillo.findById(req.params.idPlatillo);
    if (!platillo || platillo.eliminado) {
        return next(new ErrorHandler("No se encontró el Platillo en la base de datos.", 404));
    };

    platillo = await Platillo.findByIdAndUpdate(req.params.idPlatillo, {eliminado: true});

    const token = req.usuario.getJwtToken();

    // damos 5 min más en la sesión de usuario
    res.cookie('token', token, {
        expires:  new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME *60*1000),
        httpOnly: true
    })

    return res.status(200).json({
        success: true,
        message: 'Platillo eliminado exitosamente.',
        token
    });
});

// POST: /api/v1/platillo/:idPlatillo/modificador → Crea un platillo
exports.crearModificador = catchAsyncErrors(async (req, res, next) => {

    // Validar el cuerpo de la solicitud
    if (req.body.eliminado) {
        return next(new ErrorHandler("No se permite establecer 'eliminado' en la solicitud.", 400));
    };

    // Obtener el platillo correspondiente a ese id
    const platillo = await Platillo.findById(req.params.idPlatillo);

    if (!platillo || platillo.eliminado) {
        return next(new ErrorHandler("No se encontró el platillo especificado.", 404));
    }

    // Crear un nuevo modificador basado en el cuerpo de la solicitud
    const nuevoModificador = req.body;

    // Agregar el modificador al arreglo de modificadores del platillo
    platillo.modificadores.push(nuevoModificador);

    // Guardar el platillo actualizado en la base de datos
    await platillo.save();

    const token = req.usuario.getJwtToken();

    // damos 5 min más en la sesión de usuario
    res.cookie('token', token, {
        expires:  new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME *60*1000),
        httpOnly: true
    })

    return res.status(200).json({
        success: true,
        message: 'Modificador creado exitosamente.',
        data: platillo,
        token
    });
});

// PUT: /api/v1/platillo/:idPlatillo/modificador/:idModificador → Actualiza información de un modificador existente
exports.actualizarModificador = catchAsyncErrors(async (req, res, next) => {
    // Obtener el id del platillo y del modificador de la ruta
    const idPlatillo = req.params.idPlatillo;
    const idModificador = req.params.idModificador;

    // Obtener el platillo correspondiente a ese id y verificar si existe el modificador
    const platillo = await Platillo.findById(idPlatillo);

    if (!platillo || platillo.eliminado) {
        return next(new ErrorHandler("No se encontró el platillo especificado.", 404));
    }

    let modificador = platillo.modificadores.id(idModificador);

    if (!modificador || modificador.eliminado) {
        return next(new ErrorHandler("No se encontró el modificador especificado.", 404));
    }

    // Actualizar el modificador con la información recibida en el cuerpo de la solicitud
    modificador.nombre = req.body.nombre || modificador.nombre;
    modificador.precio = req.body.precio || modificador.precio;
    modificador.disponible = req.body.disponible || modificador.disponible;

    // Guardar el platillo actualizado en la base de datos
    await platillo.save();

    const token = req.usuario.getJwtToken();

    // damos 5 min más en la sesión de usuario
    res.cookie('token', token, {
        expires:  new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME *60*1000),
        httpOnly: true
    })

    return res.status(200).json({
        success: true,
        message: 'Modificador actualizado exitosamente.',
        data: platillo,
        token
    });
});

// GET:  /api/v1/platillo/:idPlatillo/modificador/ → Obtiene una lista de modificadores de un platillo en especifico
exports.obtenerModificadores = catchAsyncErrors(async (req, res, next) => {
    
    // Obtener el id del platillo
    const { idPlatillo } = req.params;

    // Buscar el platillo correspondiente en la base de datos
    const platillo = await Platillo.findById(idPlatillo);

    // Verificar que el platillo existe y no está eliminado
    if (!platillo || platillo.eliminado) {
        return next(new ErrorHandler("Platillo no encontrado.", 404));
    };

    // Obtener la lista de modificadores del platillo
    const modificadores = platillo.modificadores;

    if (!modificadores || modificadores.length === 0) {
        return next(new ErrorHandler("Modificadores no encontrados.", 404));
    };

    const token = req.usuario.getJwtToken();

    // damos 5 min más en la sesión de usuario
    res.cookie('token', token, {
        expires:  new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME *60*1000),
        httpOnly: true
    })

    // Devolver la lista de modificadores como respuesta
    return res.status(200).json({
        success: true,
        message: "Modificadores obtenidos exitosamente.",
        data: modificadores,
        token
    });
});

// GET: /api/v1/platillo/:idPlatillo/modificador/:idModificador → Obtiene información de un solo modificador de un platillo en especifico
exports.obtenerModificador = catchAsyncErrors(async (req, res, next) => {
    // Buscar el platillo por el id proporcionado en la URL
    const platillo = await Platillo.findById(req.params.idPlatillo);

    // Verificar que el platillo existe y no está eliminado
    if (!platillo || platillo.eliminado) {
        return next(new ErrorHandler('Platillo no encontrado', 404));
    }

    // Buscar el modificador
    const modificador = platillo.modificadores.id(req.params.idModificador);

    // Si el modificador no existe, retornar un error 404
    if (!modificador || modificador.eliminado) {
        return next(new ErrorHandler('Modificador no encontrado', 404));
    }

    const token = req.usuario.getJwtToken();

    // damos 5 min más en la sesión de usuario
    res.cookie('token', token, {
        expires:  new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME *60*1000),
        httpOnly: true
    })

    // Retornar el modificador encontrado
    return res.status(200).json({
        success: true,
        data: modificador,
        token
    });
});

// DELETE: /api/v1/platillo/:idPlatillo/modificador/:idModificador  → Borra un modificador de un platillo en especifico
exports.eliminarModificador = catchAsyncErrors(async (req, res, next) => {
        // Obtener el id del platillo y del modificador de la ruta
        const idPlatillo = req.params.idPlatillo;
        const idModificador = req.params.idModificador;
    
        // Obtener el platillo correspondiente a ese id y verificar si existe el modificador
        const platillo = await Platillo.findById(idPlatillo);
    
        if (!platillo || platillo.eliminado) {
            return next(new ErrorHandler("No se encontró el platillo especificado.", 404));
        }

        const modificador = platillo.modificadores.id(idModificador);
        
        if (!modificador || modificador.eliminado) {
            return next(new ErrorHandler("No se encontró el modificador especificado.", 404));
        }
    
        // Se elimina el modificador con el booleano correspondiente
        modificador.eliminado = true;
    
        // Guardar el platillo actualizado en la base de datos
        await platillo.save();

        const token = req.usuario.getJwtToken();

        // damos 5 min más en la sesión de usuario
        res.cookie('token', token, {
            expires:  new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME *60*1000),
            httpOnly: true
        })
    
        return res.status(200).json({
            success: true,
            message: 'Modificador eliminado exitosamente.',
            data: platillo,
            token
        });
});