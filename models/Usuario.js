const mogoose = require("mongoose");

const UsuariosScheme = mogoose.Schema({
  nombre: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    trim: true,
  },

  registro: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mogoose.model("Usuario", UsuariosScheme);
