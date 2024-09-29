const AWS = require('aws-sdk');
const { ContenidoVenta } = require('../models/contenidoNotaVentaModel');
const httpCodes = require('../types/http-codes');


//Configuracion de AWS
AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
});

class ContenidoVentaController{

    //Crear contenido para una nota de venta
    async createContenido(req, res) {
        try {
            const { productoId, cantidad, precioUnitario } = req.body;

            //calcular importe
            const importe = cantidad * precioUnitario;

            const nuevoContenido = await ContenidoVenta.create({
                productoId,
                cantidad,
                precioUnitario,
                importe
            });

            //Se creo
            res.status(httpCodes.CREATED).json(nuevoContenido);

        } catch (error) {
            console.error('Error al crear contenido de la nota de venta:', error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'Contenido no encontrado'});
        }
    }

    //Obtener contenido por ID
    async getContenidoById(req, res) {
        try {
            const contenido = await ContenidoVenta.findByPk(req.params.id);
            if(!contenido) {
                return res.status(httpCodes.NOT_FOUND).json({ error: 'Contenido no encontrado'});
            }
            res.status(httpCodes.OK).json(contenido);
        } catch (error) {
            console.error('Error al obtener contenido de la nota de venta:', error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'Contenido no encontrado'});
        }
    }
}

module.exports = ContenidoVentaController