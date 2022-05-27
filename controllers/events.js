const { response } = require("express");
const bcrypt = require("bcryptjs");
const Evento = require("../models/Evento");
const { generarJWT } = require("../helpers/jwt");
/*
ok:true,
msg:'Obtener evento'
*/

const obtenerEventos = async (req, res = response) => {
  try {
    const eventos = await Evento.find().populate("user", "name");

    return res.status(201).json({
      ok: true,
      eventos,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error,
    });
  }
};

const obtenerEvento = async (req, res = response) => {
  try {
    return res.status(200).json({
      ok: true,
      msg: `Obtener evento ${req.params.id}`,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error,
    });
  }
};

const crearEvento = async (req, res = response) => {
  const evento = new Evento(req.body);
  try {
    console.log("llegamos aqui");
    //Este uid se genera por el token
    evento.user = req.uid;

    console.log("llegamos a user");
    const eventoGuardado = await evento.save();
    console.log("guardamos evento");
    return res.status(200).json({
      ok: true,
      evento: eventoGuardado,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error,
    });
  }
};

//El token debe ser del usuario del evento
const actualizarEvento = async (req, res = response) => {
  const eventoId = req.params.id;
  const uid = req.uid;
  try {
    const evento = await Evento.findById(eventoId);
    console.log(evento);
    if (!evento) {
      res.status(404).json({
        ok: false,
        msg: "Evento no existe por ese id",
      });
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegio este evento",
      });
    }
    console.log("casi");
    const nuevoEvento = { ...req.body, user: uid };
    const eventoActualizado = await Evento.findByIdAndUpdate(
      eventoId,
      nuevoEvento,
      { new: true }
    );
    console.log("Falta");
    return res.status(200).json({
      ok: true,
      evento: eventoActualizado,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error,
    });
  }
};

const eliminarEvento = async (req, res = response) => {
  const eventoId = req.params.id;
  const uid = req.uid;
  try {
    const evento = await Evento.findById(eventoId);
    console.log("obtenemos evento");
    if (!evento) {
      res.status(404).json({
        ok: false,
        msg: "Evento no existe por ese id",
      });
    }
    console.log("evento existe");
    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegio de eliminar este evento",
      });
    }
    console.log("validacion");
    await Evento.findByIdAndDelete(eventoId);
    console.log("Eliminamos el evento");
    return res.status(200).json({
      ok: true,
      msg: `Evento ${eventoId} eliminado`,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error,
    });
  }
};

module.exports = {
  obtenerEventos,
  obtenerEvento,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
};
