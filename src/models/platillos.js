const mongoose = require("mongoose");

const modificadorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "Favor de ingresar el nombre del modificador."],
    maxlength: 40,
  },
  precio: {
    type: Number,
    required: [true, "Favor de ingresar un precio mayor a 0."],
    validate: {
      validator: (p) => p > 0,
      message: "El precio debe ser mayor que 0."
    }
  },
  disponible: {
    type: Boolean,
    required: true,
    default: true,
  },
  eliminado: {
    type: Boolean,
    required: true,
    default: false,
  },
  fechaCreacion: {
    type: Date,
    required: true,
    default: Date.now,
    immutable: true
  },
});

const platilloSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "Favor de ingresar el nombre del platillo."],
    maxlength: 40,
    unique: true
  },
  notas: {
    type: String,
    maxlength: 80,
  },
  precio: {
    type: Number,
    required: [true, "Favor de ingresar un precio mayor a 0."],
    validate: {
      validator: (p) => p > 0,
      message: "El precio debe ser mayor que 0."
    }
  },
  categoria: {
    type: String,
    enum: ["entrada", "plato fuerte", "postre", "bebida"],
    required: true
  },
  disponible: {
    type: Boolean,
    required: true,
    default: true,
  },
  eliminado: {
    type: Boolean,
    required: true,
    default: false,
  },
  fechaCreacion: {
    type: Date,
    required: true,
    default: Date.now,
    immutable: true
  },
  modificadores: [modificadorSchema]
});

module.exports = mongoose.model("Platillo", platilloSchema);