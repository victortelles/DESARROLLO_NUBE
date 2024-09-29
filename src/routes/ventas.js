const express = require('express');
const router = express.Router();

//Controlador
const VentaController = require('../controller/ventaController');
const ventaController = new VentaController();

//RUtas de ventas
//Obtener todas las vetnas
router.get('/', (req, res) => ventaController.getAllVentas(req, res));

//Obtener venta por id
router.get('/:id', (req, res) => ventaController.getVentaById(req, res));

//crear una nueva venta
router.post('/', (req, res) => ventaController.createVenta(req, res));

//crear una nueva venta
router.put('/:id', (req, res) => ventaController.updateVenta(req, res));

//crear una nueva venta
router.delete('/:id', (req, res) => ventaController.deleteVenta(req, res));

//Descargar PDF de la venta
router.get('/descargar/:id', (req, res) => ventaController.downloadPDF(req, res));

module.exports = router;