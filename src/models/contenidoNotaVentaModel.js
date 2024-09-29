const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const NotaVenta = require('./notaVentaModel');
const Producto = require('./productoModel');


//Definicion del contenido nota venta (tabla)
const ContenidoNotaVenta = sequelize.define('ContenidoNotaVenta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nota_venta_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: NotaVenta,
            key: 'id'
        }
    },
    producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Producto,
            key: 'id'
        }
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2), // Precio unitario del producto
        allowNull: false
    },
    importe: {
        type: DataTypes.DECIMAL(10, 2), // Importe total para este contenido
        allowNull: false
    }
}, {
    tableName: 'contenido_notas_venta', // Nombre de la tabla en la base de datos
    timestamps: false // No se usarán timestamps automáticos
});

// Definicion de relaciones
ContenidoNotaVenta.belongsTo(NotaVenta, { foreignKey: 'nota_venta_id' });
ContenidoNotaVenta.belongsTo(Producto, { foreignKey: 'producto_id' });

module.exports = ContenidoNotaVenta;
