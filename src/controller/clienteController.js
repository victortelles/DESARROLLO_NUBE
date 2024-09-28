const AWS = require('aws-sdk');
//Actualizar la region
AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
});

const s3 = new AWS.S3();
const sns = new AWS.SNS();
const httpCodes = require('../types/http-codes');

class ClientesController {

    // Método para obtener todos los clientes
    getClientes(req, res) {
        res.send('Obteniendo todos los clientes');
    }

    // Método para crear un cliente
    createCliente(req, res) {
        res.send('Cliente creado');
    }

    // Método para obtener un cliente por ID
    getClienteById(req, res) {
        res.send('Obteniendo cliente con ID: ' + req.params.id);
    }

    // Método para actualizar un cliente
    updateCliente(req, res) {
        res.send('Actualizando cliente con ID: ' + req.params.id);
    }

    // Método para eliminar un cliente
    deleteCliente(req, res) {
        res.send('Eliminando cliente con ID: ' + req.params.id);
    }
}

module.exports = ClientesController;