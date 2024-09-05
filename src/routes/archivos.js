//Express
const express = require('express');
const router = express.Router();
//importar controlador de archivos
const archivosController = require('../controllers/archivosController');

//Rutas
//GET - Local/archivos                      (Lista de archivos)
router.get('/', archivosController.listarArchivos);

//GET - Local/archivos/nombreArchivo.ext    (Descargar)
router.get('/:nombreArchivo', archivosController.descargarArchivo);

//POST - Local/archivos                     (Subir archivo seleccionado)
router.post('/', archivosController.subirArchivo);

//exportar las rutas a index-routes
module.exports = router;