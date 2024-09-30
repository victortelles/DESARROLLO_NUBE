const AWS = require('aws-sdk');
const ContenidoNotaVenta = require('../models/contenidoNotaVentaModel');
const httpCodes = require('../types/http-codes');
const PDFDocument = require('pdfkit');
const s3 = new AWS.S3();

//Configuracion de AWS
AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
});

class ContenidoVentaController{

    //Crear contenido para una nota de venta
    async createContenido(req, res) {
        try {
            const { productoId, cantidad, precioUnitario, notaVentaId } = req.body;

            //calcular importe
            const importe = cantidad * precioUnitario;

            //Crear nuevo contenido de la nota venta
            const nuevoContenido = await ContenidoNotaVenta.create({
                producto_id: productoId,
                cantidad,
                precio_unitario: precioUnitario,
                importe,
                nota_venta_id: notaVentaId
            });

            //Generacion pdf
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

            // Información que aparecerá en el PDF
            doc.text(`Contenido Nota de Venta #${nuevoContenido.id}`);
            doc.text(`Nota Venta ID: ${notaVentaId}`);
            doc.text(`Producto ID: ${productoId}`);
            doc.text(`Cantidad: ${cantidad}`);
            doc.text(`Precio Unitario: $${precioUnitario}`);
            doc.text(`Importe: $${importe}`);
            doc.end();

            const pdfData = await pdfDataPromise;

            //subir a S3
            const pdfKey = `contenido-ventas/contenido_${nuevoContenido.id}.pdf`
            const params = {
                Bucket: process.env.AWS_BUCKET_S3,
                Key: pdfKey,
                Body: pdfData,
                ContentType: 'application/pdf',
            };

            await s3.upload(params).promise();

            // URL del PDF en S3
            const pdfUrl = `https://${process.env.AWS_BUCKET_S3}.s3.amazonaws.com/${pdfKey}`;

            //Se crea
            res.status(httpCodes.CREATED).json({ contenido: nuevoContenido, pdfUrl });

        } catch (error) {
            console.error('Error al crear contenido de la nota de venta:', error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'Contenido no encontrado'});
        }
    }

    //Obtener contenido por ID
    async getContenidoById(req, res) {
        try {
            const contenido = await ContenidoNotaVenta.findByPk(req.params.id);
            if(!contenido) {
                return res.status(httpCodes.NOT_FOUND).json({ error: 'Contenido no encontrado'});
            }

            //Generar la URL
            const pdfKey = `contenido-ventas/contenido_${contenido.id}.pdf`;
            const pdfUrl = `https://${process.env.AWS_BUCKET_S3}.s3.amazonaws.com/${pdfKey}`;

            //Lo encontro
            res.status(httpCodes.OK).json({ contenido, pdfUrl });

        } catch (error) {
            console.error('Error al obtener contenido de la nota de venta:', error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ error: 'Contenido no encontrado'});
        }
    }
}

module.exports = ContenidoVentaController;