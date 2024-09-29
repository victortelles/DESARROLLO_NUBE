const AWS = require('aws-sdk');

//Configuracion AWS.
AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
});

const s3 =new AWS.S3();
const sns = new AWS.SNS();

class ProductoController{

    //Obtener todo los productos
    getAllProductos(req, res) {
        res.send('Obteniendo los productos');
    }

    //Obtener todo los productos
    getProductoById(req, res) {
        res.send('Obteniendo producto con ID: ' + req.params.id);
    }

    //Crear un nuevo producto
    createProducto(req, res) {
        res.send('Producto creado');
    }

    //actualizar producto
    updateProducto(req, res) {
        res.send('Producto actualizado'  + req.params.id);
    }

    //Eliminar producto
    deleteProducto(req, res){
        res.send('Producto eliminado.' + req.params.id);
    }
}

module.exports = ProductoController;