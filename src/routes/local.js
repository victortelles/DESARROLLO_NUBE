//Librerias
const express = require('express');
const router = express.Router();
const localController = require('../controllers/localController');

// Rutas para archivos locales
router.get('/archivos', localController.listarArchivos);
router.get('/archivos/:nombreArchivo', localController.descargarArchivo);
router.post('/archivos', localController.subirArchivo);

//Exportar
module.exports = router;
