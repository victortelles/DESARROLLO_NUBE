//librerias
const express = require('express');
const router = express.Router();
const s3Controller = require('../controllers/s3Controller.js');

// Rutas para S3
router.get('/archivos', s3Controller.listarArchivosS3);
router.get('/archivos/:nombreArchivo', s3Controller.descargarArchivoS3);
router.post('/archivos', s3Controller.subirArchivoS3);

//Exportar
module.exports = router;
