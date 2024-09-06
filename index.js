//Arranque servidor
const express = require('express');
const path = require('path')
const app  = express();
const AWS = require('aws-sdk');
const port = process.env.PORT || 3000;
//importar rutas
const routes = require('./src/routes');
//Subida de archivos - libreria
const fileUpload = require('express-fileupload');
//cargar credenciales
require('dotenv').config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

app.use(fileUpload());
//Conf Rutas
app.use('/object-storage', routes);

//Servidor
app.listen(port, () => {
    console.log(`Servidor local corriento en el puerto localhost:${port}`);
});