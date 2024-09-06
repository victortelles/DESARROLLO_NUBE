//Express
const express = require('express');
const router = express.Router();
//importar controlador de archivos
const archivosController = require('../controllers/archivosController');

//Rutas
//GET - Local/archivos                      (Lista de archivos)
router.get('/archivos', archivosController.listarArchivosS3);

//GET - Local/archivos/nombreArchivo.ext    (Descargar)
router.get('/archivos/:nombreArchivo', archivosController.descargarArchivoS3);

//POST - Local/archivos                     (Subir archivo seleccionado)
router.post('/archivos', archivosController.subirArchivoS3);

//exportar las rutas a index-routes
module.exports = router;