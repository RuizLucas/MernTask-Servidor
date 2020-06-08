const express = require("express");
const router = express.Router();
const proyectoController = require("../controllers/proyectoCotroller");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

//crear Proyectos
///api/proyectos
router.post(
  "/",
  auth,
  [check("nombre", "El nombre del proyecto es obligatorio").not().isEmpty()],
  proyectoController.crearProyecto
);

//listar proyectos
router.get("/", auth, proyectoController.obtenerProyectos);

//update proyectos
router.put(
  "/:id",
  auth,
  [check("nombre", "El nombre del proyecto es obligatorio").not().isEmpty()],
  proyectoController.actualizarProyecto
);

//elimiar
//update proyectos
router.delete(
  "/:id",
  auth, 
  proyectoController.eliminarProyecto
);
module.exports = router;
