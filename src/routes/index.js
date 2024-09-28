//librerias
const express = require('express');
const router = express.Router();

//otras rutas
const clientesRoutes = require('./clientes');
const domicilioRoutes = require('./domicilios');
const productoRoutes = require('./productos');
const ventasRoutes = require('./ventas');

// Rutas con prefijo
router.use('/clientes', clientesRoutes);
//router.use('/domicilios', domicilioRoutes);
//router.use('/productos', productoRoutes);
//router.use('/ventas', ventasRoutes);

module.exports = router;