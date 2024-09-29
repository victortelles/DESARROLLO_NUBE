//Librerias
const express = require('express');
const router = express.Router();

//Controlador de domicilio
const DomicilioController = require('../controller/domicilioController');
const domicilioController = new DomicilioController();

//Rutas de domicilios
//Obtener un domicilio especifico
router.get('/:id', (req, res) => domicilioController.getDomicilioById(req, res));

// nuevo domicilio
router.post('/', (req, res) => domicilioController.createDomicilio(req, res));

// Actualizar domicilio
router.put('/:id', (req, res) => domicilioController.updateDomicilio(req, res));

// Eliminar domicilio
router.delete('/:id', (req, res) => domicilioController.deleteDomicilio(req, res));

module.exports = router;