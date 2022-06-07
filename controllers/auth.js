const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: `un usuario existe con ese correo`,
      });
    }
    usuario = new Usuario(req.body);

    //Encriptar Contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    console.log("antes de guardar");
    await usuario.save();

    //GENERAR JWT
    const token = await generarJWT(usuario.id, usuario.name);
    console.log(token);
    return res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: error,
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { name, email, password } = req.body;
  try {
    let usuario = await Usuario.findOne({ email });
    res.json({
      ok: true,
      msg: "login",
      name,
      email,
      password,
    });

    // confirmar los passwords
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password Incorrecto",
      });
    }
    // Generar nuestro JWT

    const token = await generarJWT(usuario.id, usuario.name);

    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const revalidarToken = async (req, res = response) => {
  const { uid, name } = req;
  //generar un nuevo jwt
  const token = await generarJWT(uid, name);
  console.log("Token:", token);
  return res.json({
    ok: true,
    uid: uid,
    name: name,
    token,
  });
};

module.exports = { crearUsuario, loginUsuario, revalidarToken };
