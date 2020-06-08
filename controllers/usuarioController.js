const Usuario = require("../models/Usuario");
const bcryptsj = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.crearUsuario = async (req, res) => {
  // revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({ msj: "El usuario ya existe" });
    }

    //crear Usuario
    usuario = new Usuario(req.body);

    const salt = await bcryptsj.genSalt(10);
    usuario.password = await bcryptsj.hash(password, salt);

    //save usuario

    await usuario.save();

    //crear y firmar
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
    res.status(400).send("Hubo un error :" + error.errmsg);
  }
};
