//librerias
const express = require('express');
const router = express.Router();

// Controlador (por ahora solo se importará)
const ClientesController = require('../controller/clienteController');
const clientesController = new ClientesController();

// Rutas de Clientes
// Obtener todos los clientes
router.get('/', (req, res) => clientesController.getAllClientes(req, res));

// Obtener cliente por ID
router.get('/:id', (req, res) => clientesController.getClienteById(req, res));

// Crear nuevo cliente
router.post('/', (req, res) => clientesController.createCliente(req, res));

// Actualizar cliente
router.put('/:id',(req, res) => clientesController.updateCliente(req, res));

// Eliminar cliente
router.delete('/:id',(req, res) => clientesController.deleteCliente(req, res));

module.exports = router;
