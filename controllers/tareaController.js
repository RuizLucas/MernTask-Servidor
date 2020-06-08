const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

exports.crearTarea = async (req, res) => {
  // revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //extraer proyecto

  const { proyecto } = req.body;

  try {
    const proyectoDb = await Proyecto.findById(proyecto);

    if (!proyectoDb)
      return res.status(404).json({ msg: "Proyecto no encontrado" });

    //verificar el creador
    if (proyectoDb.creador.toString() !== req.usuario.id) {
      return res.status(401).send("No autorizado");
    }

    //crear tarea
    const tarea = new Tarea(req.body);
    tarea.save();
    res.json(tarea);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

exports.obtenerTarea = async (req, res) => {
  //extraer proyecto

  const { proyecto } = req.query;
  console.log(req.query);

  try {
    const proyectoDb = await Proyecto.findById(proyecto);

    if (!proyectoDb)
      return res.status(404).json({ msg: "Proyecto no encontrado" });

    //obtener tareas por proyecto
    const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });

    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

exports.actualizarTarea = async (req, res) => {
  //extraer proyecto

  const { proyecto, nombre, estado } = req.body;

  try {
    const proyectoDb = await Proyecto.findById(proyecto);
    let tareaDb = await Tarea.findById(req.params.id);

    if (!tareaDb)
      return res.status(404).json({ msg: "La Tarea no se encontro" });

    //verificar el creador
    if (proyectoDb.creador.toString() !== req.usuario.id) {
      return res.status(401).send("No autorizado");
    }

    //obtener tareas por proyecto
    const nuevaTareas = {};

    nuevaTareas.nombre = nombre;

    nuevaTareas.estado = estado;

    //guardar tarea
    tareaDb = await Tarea.findByIdAndUpdate(
      { _id: req.params.id },
      nuevaTareas,
      { new: true }
    );

    res.json({ tareaDb });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

exports.eliminarTarea = async (req, res) => {
  //extraer proyecto

  const { proyecto } = req.query;

  try {
    const proyectoDb = await Proyecto.findById(proyecto);
    let tareaDb = await Tarea.findById(req.params.id);

    if (!tareaDb)
      return res.status(404).json({ msg: "La Tarea no se encontro" });

    //verificar el creador
    if (proyectoDb.creador.toString() !== req.usuario.id) {
      return res.status(401).send("No autorizado");
    }

    //eliminar tarea
    await Tarea.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "tarea eliminada" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
