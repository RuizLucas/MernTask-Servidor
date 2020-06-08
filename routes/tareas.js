const express = require("express");
const router = express.Router();
const tareaController = require("../controllers/tareaController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

// Add routes api/tareas
router.get("/", auth, tareaController.obtenerTarea);

router.post(
  "/",
  auth,
  [check("nombre", "El Nombre es obligatorio").not().isEmpty()],
  [check("proyecto", "El Proyecto es obligatorio").not().isEmpty()],
  tareaController.crearTarea
);

router.put("/:id", auth, tareaController.actualizarTarea);
router.delete("/:id", auth, tareaController.eliminarTarea);

module.exports = router;
