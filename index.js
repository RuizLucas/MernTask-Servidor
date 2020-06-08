const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");

//crea el servidor
const app = express();
//conectar a db
conectarDB();

//Habilitar Cors
app.use(cors());

//expres .json
app.use(express.json({ extends: true }));

//puerto del app
const port = process.env.port || 4000;

//importar rutas
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/proyectos", require("./routes/proyectos"));
app.use("/api/tareas", require("./routes/tareas"));

//arrancar app
app.listen(port, "0.0.0.0", () => {
  console.log(`El servidor esta funcionando en el puerto ${PORT}`);
});
