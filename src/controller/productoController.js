const AWS = require('aws-sdk');
const httpCodes = require('../types/http-codes');
const db = require('../config/db');

//Configuracion AWS.
AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
});

const s3 =new AWS.S3();
const sns = new AWS.SNS();

class ProductoController{

    //Obtener todo los productos
    async getAllProductos(req, res) {
        try {
            const [productos] = await db.query('SELECT * FROM productos');
            //obtenido
            res.status(httpCodes.OK).json(productos);

        } catch (error) {
            console.error(error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener los productos' });
        }
    }

    //Obtener todo los productos
    async getProductoById(req, res) {
        const { id } = req.params;
        try {
            const [producto] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
            if (producto.lenght === 0) {
                return res.status(httpCodes.NOT_FOUND).send('Producto no encontrado');
            }
            //Obtenido
            res.status(httpCodes.OK).json(producto[0]);
        } catch (error) {
            console.error(error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).send('Error al obtener el producto');
        }
    }

    //Crear un nuevo producto
    async createProducto(req, res) {
        const {nombre, unidadMedida, precioBase } = req.body;
        try {
            const [result] = await db.query('INSERT INTO Productos (nombre, unidad_medida, precio_base) VALUES (?, ?, ?)', [nombre, unidadMedida, precioBase]);
            //Creado
            res.status(httpCodes.CREATED).json({ id: result.insertId, nombre, unidadMedida, precioBase });
        } catch (error) {
            console.error(error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error al crear el producto'});
        }
    }

    //actualizar producto
    async updateProducto(req, res) {
        const { id } = req.params;
        const { nombre, unidadMedida, precioBase } = req.body;
        try {
            const [result] = await db.query('UPDATE Productos SET nombre = ?, unidad_medida = ?, precio_base = ? WHERE id = ?', [nombre, unidadMedida, precioBase, id]);
            if (result.affectedRows === 0) {
                return res.status(httpCodes.NOT_FOUND).send('Producto no encontrado');
            }

            //Actualizado
            res.status(httpCodes.OK).send('Producto actualizado');

        } catch (error) {
            console.error(error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error al actualizar el producto'});

        }
    }

    //Eliminar producto
    async deleteProducto(req, res){
        const { id } = req.params;
        try {
            const [result] = await db.query('DELETE FROM Productos WHERE id = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(httpCodes.NOT_FOUND).send('Producto no encontrado');
            }
            //Eliminado
            res.status(httpCodes.OK).send('Producto eliminado');
        } catch (error) {
            console.error(error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error al eliminar el producto'});
        }
    }
}

module.exports = ProductoController;