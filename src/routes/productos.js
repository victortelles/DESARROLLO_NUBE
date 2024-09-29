//Librerias
const express = require('express')
const router = express.Router();

//Controlador del producto
const ProductoController = require('../controller/productoController');
const productoController = new ProductoController();

// Rutas de Productos
// Obtener todos los productos
router.get('/', (req, res) => productoController.getAllProductos(req, res));

// Obtener producto por ID
router.get('/:id', (req, res) => productoController.getProductoById(req, res));

// Crear nuevo producto
router.post('/', (req, res) => productoController.createProducto(req, res));

// Actualizar producto
router.put('/:id', (req, res) => productoController.updateProducto(req, res));

// Eliminar producto
router.delete('/:id', (req, res) => productoController.deleteProducto(req, res));

module.exports = router;