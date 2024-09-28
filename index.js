//librerias
const express = require('express');
const dotenv = require('dotenv');
const routes = require('./src/routes/index');

//Cargar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extend : true }));

app.use(express.json());

//Ruta main
app.use('/', routes);

//Ejecucion del servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});