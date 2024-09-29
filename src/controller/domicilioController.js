const AWS = require('aws-sdk');
const httpCodes = require('../types/http-codes');
const db = require('../config/db');
const Domicilio = require('../models/domicilioModel');

const s3 = new AWS.S3();
const sns = new AWS.SNS();

//Conf AWS
AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
});


class DomicilioController {

    //Obtener domicilio por ID
    async getDomicilioById(req, res) {
        try {
            const id = req.params.id;
            const domicilio = await Domicilio.findByPk(id);
            if (!domicilio) {
                return res.status(httpCodes.NOT_FOUND).json({ message: 'Domicilio no encontrado'});
            }
            //Se encontro
            return res.status(httpCodes.OK).json(domicilio);

        } catch (error) {
            console.error('Error al obtener el domicilio: ', error);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener el domicilio '});
        }
    }

    //Crear nuevo domicilio
    async createDomicilio(req, res){
        try {
            const { cliente_id, domicilio, colonia, municipio, estado, tipo_direccion } = req.body;
            const nuevoDomicilio = await Domicilio.create({ cliente_id, domicilio, colonia, municipio, estado, tipo_direccion });
            return res.status(httpCodes.CREATED).json(nuevoDomicilio);
        } catch (error) {
            console.error('Error al crear el domicilio:', error);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error al crear el domicilio' });

        }
    }

    //Actualizacion Domicilio
    async updateDomicilio(req, res) {
        try {
            const id = req.params.id;
            const { domicilio, colonia, municipio, estado, tipo_direccion } = req.body;
            const [ updated ] = await Domicilio.update({ domicilio, colonia, municipio, estado, tipo_direccion }, {
                where: { id: id }
            });

            if (!updated) {
                return res.status(httpCodes.NOT_FOUND).json({ message: 'Domicilio no encontrado'});
            }
            return res.status(httpCodes.OK).json({ message: 'Domicilio actualizado' });

        } catch (error) {
            console.error('Error al actualizar el domicilio:', error);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error al actualizar el domicilio' });
        }
    }

    //Eliminacion del domicilio
    async deleteDomicilio(req, res) {
        try {
            const id = req.params.id;
            const deleted = await Domicilio.destroy({ where: { id: id } });
            if (!deleted){
                return res.status(httpCodes.NOT_FOUND).json({ message: 'Domicilio no encontrado' });
            }
            return res.status(httpCodes.OK).json({ message: 'Domicilio eliminado' });
        } catch (error) {
            console.error('Error al eliminar el domicilio:', error);
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error al eliminar el domicilio' });
        }
    }
}

module.exports = DomicilioController