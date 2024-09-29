const AWS = require('aws-sdk');

//Conf AWS
AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
});

const s3 = new AWS.S3();
const sns = new AWS.SNS();

class DomicilioController {

    //Obtener domicilio por ID
    getDomicilioById(req, res) {
        res.send('Obteniendo el domicilio con ID: ' + req.params.id);
    }

    //Crear nuevo domicilio
    createDomicilio(req, res){
        res.send('Domicilio creado');
    }

    //Actualizacion Domicilio
    updateDomicilio(req, res) {
        res.send('Domicilio actualizado'  + req.params.id);
    }

    //Eliminacion del domicilio
    deleteDomicilio(req, res) {
        res.send('Domicilio eliminado'  + req.params.id);
    }
}

module.exports = DomicilioController