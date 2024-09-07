// Librerías necesarias
const express = require('express');
const path = require('path');
const AWS = require('aws-sdk');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Configuración de AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const app = express();
const port = process.env.PORT || 3000;

// Subida de archivos
app.use(fileUpload());

// Importar rutas
const localRoutes = require('./src/routes/local');
const s3Routes = require('./src/routes/s3');

// Rutas para archivos locales
app.use('/local', localRoutes);

// Rutas para S3
app.use('/object-storage', s3Routes);

// Ubicacion de archivos
app.use('/assets', express.static(path.join(__dirname, 'src/assets')));

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
