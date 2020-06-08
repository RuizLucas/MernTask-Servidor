const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  //Leer Token
  const token = req.header("x-auth-token");

  //Revisar
  if (!token) {
    return res.status(401).json({ msg: "No hay token, permisos no valido" });
  }

  //validar
  try {
    const cifrado = jwt.verify(token, process.env.SECRETA);
    req.usuario = cifrado.usuario;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token no valido" });
  }
};
