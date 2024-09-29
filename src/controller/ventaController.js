const AWS = require('aws-sdk');
const httpCodes = require('../types/http-codes');
const { NotaVenta } = require('../models/notaVentaModel');

// Configuración de AWS
AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
});

//Clase
class VentaController {

    //Obtener todas las ventas
    async getAllventas(req, res) {
        try{
            const ventas = await NotaVenta.findAll();
            res.status(httpCodes.OK).json(ventas);

        } catch (error) {
            console.error("Error al obtener las notas de venta: ", error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener las ventas'})
        }
    }

    //Obtener venta por ID
    async getVentaById(req, res){
        try{
            const venta = await NotaVenta.findByPk(req.params.id);
            if (!venta) {
                res.status(httpCodes.NOT_FOUND).json({ message: 'Nota de venta no encontrada'});
            }
            //Venta encontrada
            res.status(httpCodes.OK).json(venta);
        } catch  (error) {
            console.error('Error al obtener nota de venta por ID:', error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener la nota de venta'});
        }
    }

    //Crear nueva venta
    async createVenta(req, res) {
        try {
            const { clienteId, direccionFacturacion, direccionEnvio, totalNota } = req.body;
            const nuevaVenta = await NotaVenta.create({
                clienteId,
                direccionFacturacion,
                direccionEnvio,
                totalNota
            })

            //Implementar en un futuro la generacion de PDF y subirse a S3

            //Se creo nueva venta
            res.status(httpCodes.CREATED).json(nuevaVenta);
        } catch (error) {
            console.error('Error al crear nueva nota de venta:', error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error al crear la nota de venta'});
        }
    }

    //Actualizar ventas
    async updateVenta(req, res) {
        try {
            const { id } = req.params;
            const { direccionFacturacion, direccionEnvio, totalNota } = req.body;

            const venta = await NotaVenta.findByPk(id);
            if (!venta) {{}
                return res.status(httpCodes.NOT_FOUND).json({ error: 'Nota de venta no encontrada'});
            }

            await venta.update({
                direccionFacturacion,
                direccionEnvio,
                totalNota
            });
            //Nota venta Actulizada
            res.status(httpCodes.OK).json(venta);
        } catch (error) {
            console.error('Error al actualizar nota de venta:', error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error al actualizar la nota de venta' });
        }
    }

    //Eliminar ventas
    async deleteVenta(req, res){
        try {
            const { id } = req.params;
            const venta= await NotaVenta.findByPk(id);
            if (!venta) {
                return res.status(httpCodes.NOT_FOUND).json({ error: 'Nota de venta no encontrada'});
            }

            await venta.destroy();
            res.status(httpCodes.OK).json({ message: "Nota de venta eliminada"});
        } catch (error) {
            console.error('Error al eliminar nota de venta:', error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error al eliminar la nota de venta ' })
        }
    }

    //Descargar PDF de una venta
    downloadPDF(req, res) {
        res.send('Descargando PDF de la venta con ID: '+ req.params.id);
    }
}

module.exports = VentaController;