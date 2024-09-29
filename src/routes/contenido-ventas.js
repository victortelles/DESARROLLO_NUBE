const express = require('express');
const router = express.Router();

//COntroladores
const ContenidoVentaController = require('../controller/contenidoVentaController');
const contenidoVentaController = new ContenidoVentaController();

//Rutas

//Obtener contenido por ID
router.get('/:id', (req, res) => contenidoVentaController.getContenidoById(req, res));

//Crear contenido para una nota de venta
router.post('/', (req, res) => contenidoVentaController.createContenido(req, res));

module.exports = router;