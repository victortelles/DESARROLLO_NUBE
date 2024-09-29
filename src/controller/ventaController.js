const AWS = require('aws-sdk');

// Configuración de AWS
AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
});

const s3 = new AWS.S3();
const sns = new AWS.SNS();

//Clase
class VentaController {

    //Obtener todas las ventas
    getAllventas(req, res) {
        res.send('Obteniendo todas las ventas');
    }

    //Obtener venta por ID
    getVentaById(req, res){
        res.send('Obteniendo venta por ID' + req.params.id);
    }

    //Crear nueva venta
    createVenta(req, res) {
        res.send('Venta Creada');
    }

    //Descargar PDF de una venta
    downloadPDF(req, res) {
        res.send('Descargando PDF de la venta con ID: '+ req.params.id);
    }
}

module.exports = VentaController;