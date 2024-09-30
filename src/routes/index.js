//librerias
const express = require('express');
const router = express.Router();

//otras rutas
const clientesRoutes = require('./clientes');
const domiciliosRoutes = require('./domicilios');
const productosRoutes = require('./productos');
const ventasRoutes = require('./ventas');
const contenido_ventas = require('./contenido-ventas');

// Rutas con prefijo
router.use('/clientes', clientesRoutes);
router.use('/domicilios', domiciliosRoutes);
router.use('/productos', productosRoutes);
router.use('/ventas', ventasRoutes);
router.use('/contenido_ventas', contenido_ventas);

module.exports = router;