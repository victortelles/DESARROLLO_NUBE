const AWS = require('aws-sdk');

//Configuracion de AWS
AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
});

class ContenidoVentaController{

    //Crear contenido para una nota de venta
    createContenido(req, res) {
        res.send('Contenido de la nota de venta creado');
    }

    //Obtener contenido por ID
    getContenidoById(req, res) {
        res.send('Contenido de la nota de venta con ID:' + req.params.id);
    }
}

module.exports = ContenidoVentaController