const AWS = require('aws-sdk');
const httpCodes = require('../types/http-codes');
const db = require('../config/db');
const Producto = require('../models/productoModel');

//Configuracion AWS.
AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
});


class ProductoController{

    //Obtener todo los productos
    async getAllProductos(req, res) {
        try {
            const productos = await Producto.findAll();
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
            const producto= await Producto.findByPk(id);
            if (!producto) {
                return res.status(httpCodes.NOT_FOUND).send('Producto no encontrado');
            }
            //Obtenido
            res.status(httpCodes.OK).json(producto);
        } catch (error) {
            console.error(error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).send('Error al obtener el producto');
        }
    }

    //Crear un nuevo producto
    async createProducto(req, res) {
        const {nombre, unidad_medida, precio_base } = req.body;

        //validaciones
        if(!nombre || !unidad_medida || precio_base == null){
            return res.status(httpCodes.BAD_REQUEST).json({ message: 'Todos los campos son obligatorios.'});
        }

        try {
            const nuevoProducto = await Producto.create({
                nombre,
                unidad_medida,
                precio_base
            });
            //Creado
            res.status(httpCodes.CREATED).json(nuevoProducto);

        } catch (error) {
            console.error(error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error al crear el producto'});
        }
    }

    //actualizar producto
    async updateProducto(req, res) {
        const { id } = req.params;
        const { nombre, unidad_medida, precio_base } = req.body;

        try {
            const producto = await Producto.findByPk(id);

            //Si no existe el producto
            if(!producto) {
                return res.status(httpCodes.NOT_FOUND).json({ message: 'Producto no encontrado' });
            }

            //Actualizacion
            await producto.update({ nombre, unidad_medida, precio_base });
            res.status(httpCodes.OK).json({ message: 'Producto actualizado '});

        } catch (error) {
            console.error(error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error al actualizar el producto'});
        }
    }

    //Eliminar producto
    async deleteProducto(req, res){
        const { id } = req.params;
        try {
            const producto = await Producto.findByPk(id);
            if(!producto) {
                return res.status(httpCodes.NOT_FOUND).json({ message: 'Producto no encontrado' });
            }

            //Eliminado
            await producto.destroy();
            res.status(httpCodes.OK).json({ message: 'Producto eliminado'});

        } catch (error) {
            console.error(error);
            res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error al eliminar el producto'});
        }
    }
}

module.exports = ProductoController;