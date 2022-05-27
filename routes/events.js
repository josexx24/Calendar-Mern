const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { isDate } = require("../helpers/isDate");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  obtenerEventos,
  obtenerEvento,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
} = require("../controllers/events");
const router = Router();

router.use(validarJWT);

//Obtener eventos
router.get("/", obtenerEventos);

//Obtener un evento
router.get("/:id", obtenerEvento);

//Crear eventos
router.post(
  "/",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "Fecha de inicio obligatoria").custom(isDate),
    check("end", "La fecha de termino es obligatoria").custom(isDate),
    validarCampos,
  ],
  crearEvento
);

//Actualizar Evento
router.put("/:id", actualizarEvento);

//Eliminar evento
router.delete("/:id", eliminarEvento);

module.exports = router;
