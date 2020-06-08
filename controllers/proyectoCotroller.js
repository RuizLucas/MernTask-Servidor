const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

exports.crearProyecto = async (req, res) => {
  // revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    //Crear nuevo Proyecto
    const proyecto = new Proyecto(req.body);

    //guardar el crador
    proyecto.creador = req.usuario.id;
    //guardar
    proyecto.save();
    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//obtiene todos los proyecto del usuario actual

exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({
      creado: -1,
    });
    res.json({ proyectos });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//update proyecto

exports.actualizarProyecto = async (req, res) => {
  // revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    //extraer info proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};
    if (nombre) {
      nuevoProyecto.nombre = nombre;
    }
    //revisar el id
    let proyecto = await Proyecto.findById(req.params.id);

    //existe?
    if (!proyecto) {
      return res.status(404).send("Proyecto no encontrado");
    }
    //verificar el creador
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).send("No autorizado");
    }
    //update
    proyecto = await Proyecto.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: nuevoProyecto },
      { new: true }
    );
    res.json({ proyecto });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Eliminar proyecto

exports.eliminarProyecto = async (req, res) => {
  try {
    //revisar el id
    let proyecto = await Proyecto.findById(req.params.id);

    //existe?
    if (!proyecto) {
      return res.status(404).send("Proyecto no encontrado");
    }
    //verificar el creador
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).send("No autorizado");
    }
    //Eliminar
    await Proyecto.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Proyecto Eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
