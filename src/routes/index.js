//Express
const express = require('express');
const router = express.Router();

// Importar las rutas /archivos
const archivosRoutes = require('./archivos');

// Usar la ruta /archivos
router.use('/archivos', archivosRoutes);

// Exportar rutas
module.exports = router;
