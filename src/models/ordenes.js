const mongoose = require("mongoose");

const ordenSchema = new mongoose.Schema({
  propina: {
    type: Number,
    enum: [0, 0.05, 0.1, 0.15],
    required: true,
    default: 0
  },
  metodoPago: {
    type: String,
    enum: ["contra entrega", "tarjeta de crédito"],
    required: [true, "Favor de seleccionar un método de pago."]
  },
  estatus: {
    type: String,
    enum: ["preparando", "entregado", "cancelado"],
    required: true,
    default: "preparando"
  },
  platillos: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Platillo",
      required: true
    },
    nombre: {
      type: String,
      required: [true, "Favor de ingresar el nombre del platillo."],
      maxlength: 40,
    },
    cantidad: {
      type: Number,
      required: [true, "Favor de ingresar una cantidad mayor a 0."],
      validate: {
        validator: (c) => c > 0,
        message: "La cantidad debe ser mayor que 0."
      }
    },
    precio: {
      type: Number,
      required: [true, "Favor de ingresar un precio mayor a 0."],
      validate: {
        validator: (p) => p > 0,
        message: "El precio debe ser mayor que 0."
      }
    },
    modificadores: [{
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Modificador",
        required: true
      },
      precio: {
        type: Number,
        required: [true, "Favor de ingresar un precio mayor a 0."],
        validate: {
          validator: (p) => p > 0,
          message: "El precio debe ser mayor que 0."
        }
      },
    }],
  }],
  total: {
    type: Number,
    required: true,
    validate: {
      validator: (t) => t > 0,
      message: "El total debe ser mayor que 0."
    }
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  fechaCreacion: {
    type: Date,
    required: true,
    default: Date.now,
    immutable: true
  }
});

module.exports = mongoose.model("Orden", ordenSchema);