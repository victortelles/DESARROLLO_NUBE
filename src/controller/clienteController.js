const Cliente  = require('../models/clienteModel');
const httpCodes = require('../types/http-codes');

const AWS = require('aws-sdk');
//Actualizar la region
AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
});

class ClientesController {

    // metodo para obtener todos los clientes
    async getClientes(req, res) {
        try {
            const clientes = await Cliente.findAll();
            res.status(httpCodes.OK).json(clientes);
        } catch (error) {
            console.error('Error al obtener clientes: ', error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error al obtener los clientes'});
        }
    }

    // Método para obtener un cliente por ID
    async getClienteById(req, res) {
        try {
            const cliente = await Cliente.findByPk(req.params.id);
            if(!cliente) {
                return res.status(httpCodes.NOT_FOUND).json({ error: 'Cliente no encontrado' });
            }
            res.status(httpCodes.OK).json(cliente);
        } catch (error) {
            console.error('Error al obtener cliente por ID:' , error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error al obtener el cliente'});
        }
    }

    // Método para crear un cliente
    async createCliente(req, res) {
        try {
            const { razon_social, nombre_comercial, correo_electronico } = req.body;
            const nuevoCliente = await Cliente.create({
                razon_social,
                nombre_comercial,
                correo_electronico
            });
            //Se crea el usuario
            res.status(httpCodes.CREATED).json(nuevoCliente);

        } catch (error) {
            console.error('Error al crear cliente: ', error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error al crear el cliente'});
        }
    }


    // Método para actualizar un cliente
    async updateCliente(req, res) {
        try {
            //Solicitud
            const { id } = req.params;
            const { razon_social, nombre_comercial, correo_electronico } = req.body;

            const cliente = await Cliente.findByPk(id);
            if (!cliente) {
                return res.status(httpCodes.NOT_FOUND).json({ error: 'Cliente no encontrado' });
            }

            //Actualización
            await cliente.update({
                razon_social,
                nombre_comercial,
                correo_electronico
            });
            res.status(httpCodes.OK).json(cliente);

        } catch (error) {
            console.error ('Error al actualizar al cliente: ', error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error al actualizar al cliente'});
        }
    }

    // Método para eliminar un cliente
    async deleteCliente(req, res) {
        try {
            const { id } = req.params;
            const cliente = await Cliente.findByPk(id);
            if (!cliente) {
                return res.status(httpCodes.NOT_FOUND).json({ error: 'Cliente no encontrado' });
            }

            //Eliminacion
            await cliente.destroy();
            res.status(httpCodes.OK).json({ message: `Cliente con id: ${cliente.id} ha sido eliminado`});

        } catch (error) {
            console.error('Error al eliminar al cliente: ', error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error al eliminar al cliente'});
        }
    }
}

module.exports = ClientesController;