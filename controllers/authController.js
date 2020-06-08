const Usuario = require("../models/Usuario");
const bcryptsj = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.autenticarUsuario = async (req, res) => {
  // revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  const { email, password } = req.body;

  try {
    //revisar que sea una usuario registrado

    let usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({ msg: "El usuario no existe" });
    }
    //revisar pass
    const passCorrecto = await bcryptsj.compare(password, usuario.password);

    if (!passCorrecto) {
      return res.status(400).json({ msg: "Password incorrecto" });
    }

    //crear y firmar JWT
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };
    //firmar jwt
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600000,
      },
      (error, token) => {
        if (error) throw error;

        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.usuarioAutenticado = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-password");
    res.json({ usuario });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Ocurrio un Error" });
  }
};
