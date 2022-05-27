const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { dbConnection } = require("./database/config");

//crear el servidor express
const app = express();

// Base de Datos
dbConnection();

//CORS
app.use(cors());

//Directorio Público
app.use(express.static("public"));

//Lecture y parseo del body
app.use(express.json());

//Rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));
/*
TODO auth // crear,login, renew
TODO CRUD: eventos
*/
//Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
