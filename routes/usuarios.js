//Rutas para crear usuarios
const express = require("express");
const routes = express.Router();

//controllers
const usuarioController = require("../controllers/usuarioController");

const { check } = require("express-validator");

//crear usuario
///api/usuarios
routes.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "Agregar un email valido").isEmail(),
    check("password", "El password debe ser mino 6 caracteres").isLength({
      min: 6,
    }),
  ],
  usuarioController.crearUsuario
);

module.exports = routes;
