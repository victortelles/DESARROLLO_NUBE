//Arranque servidor
const express = require('express');
const path = require('path')
const app  = express();
const port = process.env.PORT || 3000;
//importar rutas
const routes = require('./src/routes');
//Subida de archivos - libreria
const fileUpload = require('express-fileupload');

//Rutas
//Ruta para archivos (/assets)
app.use('/assets', express.static(path.join(__dirname, 'src/assets')));

app.use(fileUpload());
//Conf Rutas
app.use('/local', routes);

//Servidor
app.listen(port, () => {
    console.log(`Servidor local corriento en el puerto localhost:${port}`);
});