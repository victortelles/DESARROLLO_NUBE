const AWS = require('aws-sdk');
const httpCodes = require('../types/http-codes');
const NotaVenta = require('../models/notaVentaModel');
const PDFDocument = require('pdfkit');
const s3 = new AWS.S3();
const sns = new AWS.SNS();
require('dotenv').config();

// Configuración de AWS
AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
});

//Clase
class VentaController {

    //Obtener todas las ventas
    async getAllventas(req, res) {
        try {
            const ventas = await NotaVenta.findAll();
            res.status(httpCodes.OK).json(ventas);

        } catch (error) {
            console.error("Error al obtener las notas de venta: ", error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener las ventas' })
        }
    }

    //Obtener venta por ID
    async getVentaById(req, res) {
        try {
            const venta = await NotaVenta.findByPk(req.params.id);
            if (!venta) {
                res.status(httpCodes.NOT_FOUND).json({ message: 'Nota de venta no encontrada' });
            }

            //Venta encontrada
            res.status(httpCodes.OK).json(venta);
        } catch (error) {
            console.error('Error al obtener nota de venta por ID:', error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener la nota de venta' });
        }
    }

    //Crear nueva venta
    async createVenta(req, res) {
        try {
            const { cliente_id, direccion_facturacion_id, direccion_envio_id, total_nota } = req.body;
            //Nueva venta
            const nuevaVenta = await NotaVenta.create({
                cliente_id,
                direccion_facturacion_id,
                direccion_envio_id,
                total_nota
            });

            //Generacion de PDF
            const doc = new PDFDocument();
            const pdfBuffers = [];

            doc.on('data', (chunk) => pdfBuffers.push(chunk));

            //Promesa del pdf
            const pdfDataPromise = new Promise((resolve, reject) => {
                doc.on('end', () => {
                    const pdfData = Buffer.concat(pdfBuffers);
                    resolve(pdfData);
                });
                doc.on('error', (err) => reject(err));
            });

            //Info PDF
            doc.text(`Nota de venta #${nuevaVenta.id}`);
            doc.text(`Cliente ID:: ${cliente_id}`);
            doc.text(`Dirección de facturación: ${direccion_facturacion_id}`);
            doc.text(`Dirección de envío: ${direccion_envio_id}`);
            doc.text(`Total: $${total_nota}`);
            doc.end();

            //Esperar a la generacion del pdf
            const pdfData = await pdfDataPromise;

            //Subir PDf a S3
            const pdfKey = `notas-de-venta/nota_${nuevaVenta.id}.pdf`;
            const params = {
                Bucket: process.env.AWS_BUCKET_S3,
                Key: pdfKey,
                Body: pdfData,
                ContentType: 'application/pdf',
                //ACL: 'public-read', //Enlace de descarga
            };

            await s3.upload(params).promise();

            //URL de pdf en s3
            const pdfUrl = `https://${process.env.AWS_BUCKET_S3}.s3.amazonaws.com/${pdfKey}`;

            const snsParams = {
                Message: `Gracias por su compra. Aquí tiene la nota de venta #${nuevaVenta.id}. Puede descargar el PDF de la nota en el siguiente enlace: ${pdfUrl}`,
                Subject: `Nota de venta #${nuevaVenta.id}`,
                TopicArn: process.env.AWS_SNS_TOPIC_ARN,
                MessageAttributes: {
                    'AWS.SNS.SMS.SMSType': {
                        DataType: 'String',
                        StringValue: 'Transactional',
                    }
                }
            };

            //Enviar notificacion
            await sns.publish(snsParams).promise();

            //Notf: Creada la venta
            res.status(httpCodes.CREATED).json({
                venta: nuevaVenta,
                pdfUrl
            });

        } catch (error) {
            console.error('Error al crear nueva nota de venta:', error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error al crear la nota de venta' });
        }
    }

    //Actualizar ventas
    async updateVenta(req, res) {
        try {
            const { id } = req.params;
            const { direccion_facturacion_id, direccion_envio_id, total_nota } = req.body;

            const venta = await NotaVenta.findByPk(id);
            if (!venta) {
                return res.status(httpCodes.NOT_FOUND).json({ error: 'Nota de venta no encontrada' });
            }

            //Actualizar la venta en RDS
            await venta.update({
                direccion_facturacion_id,
                direccion_envio_id,
                total_nota
            });

            //Generacion de un nuevo PDF
            const doc = new PDFDocument();
            const pdfBuffers = [];

            doc.on('data', (chunk) => pdfBuffers.push(chunk));

            const pdfDataPromise = new Promise((resolve, reject) => {
                doc.on('end', () => {
                    const pdfData = Buffer.concat(pdfBuffers);
                    resolve(pdfData);
                });
                doc.on('error', (err) => reject(err));
            });

            //Info a actualizar el PDF
            doc.text(`Nota de venta actualizada #${venta.id}`);
            doc.text(`Cliente ID: ${venta.cliente_id}`);
            doc.text(`Dirección de facturación: ${direccion_facturacion_id}`);
            doc.text(`Dirección de envío: ${direccion_envio_id}`);
            doc.text(`Total actualizado: $${total_nota}`);
            doc.end();

            //Esperar la generacion del PDF
            const pdfData =await pdfDataPromise;

            //Subir a s3
            const pdfKey = `notas-de-venta/nota_${venta.id}.pdf`;
            const params = {
                Bucket: process.env.AWS_BUCKET_S3,
                Key: pdfKey,
                Body: pdfData,
                ContentType: 'application/pdf',
                //ACL: 'public-read',
            };

            await s3.upload(params).promise();

            //URL de PDF Actualizado en S3
            const pdfUrl = `https://${process.env.AWS_BUCKET_S3}.s3.amazonaws.com/${pdfKey}`;

            //Enviar notificacion
            const snsParams = {
                Message: `Nota de venta actualizada #${venta.id} disponible en ${pdfUrl}`,
                Subject: `Nota de venta #${venta.id} actualizada`,
                TopicArn: process.env.AWS_SNS_TOPIC_ARN,
            };
            await sns.publish(snsParams).promise();

            //Nota venta Actulizada
            res.status(httpCodes.OK).json({ message: 'Venta y PDF actualizados', pdfUrl });

        } catch (error) {
            console.error('Error al actualizar nota de venta:', error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error al actualizar la nota de venta' });
        }
    }

    //Eliminar ventas
    async deleteVenta(req, res) {
        try {
            const { id } = req.params;
            const venta = await NotaVenta.findByPk(id);
            if (!venta) {
                return res.status(httpCodes.NOT_FOUND).json({ error: 'Nota de venta no encontrada' });
            }

            //Eliminar el pdf de s3
            const pdfKey = `notas-de-venta/nota_${venta.id}.pdf`;
            const params ={
                Bucket: process.env.AWS_BUCKET_S3,
                Key: pdfKey,
            };

            //Eliminar objeto en s3
            await s3.deleteObject(params).promise();

            //Eliminar venta en RDS
            await venta.destroy();
            res.status(httpCodes.OK).json({ message: 'Nota de venta eliminada y PDF eliminado' });

        } catch (error) {
            console.error('Error al eliminar nota de venta:', error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error al eliminar la nota de venta ' })
        }
    }

    //Descargar PDF de una venta (falta)
    async downloadPDF(req, res) {
        try {
            const { id } = req.params;

            const venta = await NotaVenta.findByPk(id);
            if (!venta) {
                return res.status(httpCodes.NOT_FOUND).json({ message: 'Nota de venta no encontrada' });
            }

            //Generar la URL del PDF almacenadado en S3
            const pdfKey = `notas-de-venta/nota_${venta.id}.pdf`;

            //Validar si existe en s3
            const params = {
                Bucket: process.env.AWS_BUCKET_S3,
                Key: pdfKey,
            }

            try {
                await s3.headObject(params).promise();
            } catch (s3Error) {
                if(s3Error.code === 'NotFound'){
                    return res.status(httpCodes.NOT_FOUND).json({ message: 'PDF no encontrado' });
                } else {
                    throw s3Error;
                }
            }

            // Descargar el archivo PDF desde S3
            const pdfObject = await s3.getObject(params).promise();

            // Configurar los encabezados para vista previa y descarga
            res.setHeader('Content-Type', 'application/pdf');
            //res.setHeader('Content-Disposition', `inline; filename=nota_${venta.id}.pdf`);
            res.setHeader('Content-Disposition',  `attachment; filename=nota_${venta.id}.pdf`);
            res.setHeader('Content-Length', pdfObject.ContentLength);

            // Enviar el archivo PDF como respuesta
            res.status(httpCodes.OK).send(pdfObject.Body);

            /**
            //Generar la url del pdf almacenado en s3 si existe.
            const pdfUrl = `https://${process.env.AWS_BUCKET_S3}.s3.amazonaws.com/${pdfKey}`;

            //Obtenido
            res.status(httpCodes.OK).json({ pdfUrl });
            **/
        } catch (error) {
            console.error('Error al descargar el PDF:' , error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error al descargar el PDF' });
        }
    }
}

module.exports = VentaController;