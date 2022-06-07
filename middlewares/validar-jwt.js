const { response } = require("express");
const jwt = require("jsonwebtoken");

const validarJWT = (req, res = response, next) => {
  // ?????
  console.log("validar (no verificado):", req.header("x-token"));
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token",
    });
  }
  try {
    console.log("vamos a validar:");
    const { uid, name } = jwt.verify(
      token,
      process.env.SECRET_JWT_SEED,
      function (err, decoded) {
        console.log("Error:", err ? err.name : err);
        console.log("Decoded:", decoded);
        if (err) {
          if (err.name !== "TokenExpiredError") {
            localStorage.removeItem("x-token");
          } else if (err.name === "TokenExpiredError") {
            console.log("Token Expirado");
            const { uid, name } = jwt.decode(token);
            console.log("renew:", uid, name);
            return { uid, name };
          }
        }
        const { uid, name } = decoded;
        return { uid, name };
      }
    );
    console.log("validacion (ya verificado):", uid, name);
    req.uid = uid;
    req.name = name;
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: error,
    });
  }

  next();
};

module.exports = {
  validarJWT,
};
