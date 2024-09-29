const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Cliente = require('./clienteModel');
const Domicilio = require('./domicilioModel');


//Definicion del modelo de Nota venta (Tabla)
const NotaVenta = sequelize.define('NotaVenta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cliente,
            key: 'id'
        }
    },
    direccion_facturacion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Domicilio,
            key: 'id'
        }
    },
    direccion_envio_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Domicilio,
            key: 'id'
        }
    },
    total_nota: {
        type: DataTypes.DECIMAL(10, 2), // Valor con dos decimales para el total de la nota
        allowNull: false
    }
}, {
    tableName: 'notas_venta', // Nombre de la tabla en la base de datos
    timestamps: false // No se usarán timestamps automáticos
});

//Definir Relaciones
NotaVenta.belongsTo(Cliente, { foreignKey: 'cliente_id' });
NotaVenta.belongsTo(Domicilio, { as: 'DireccionFacturacion', foreignKey: 'direccion_facturacion_id'});
NotaVenta.belongsTo(Domicilio, { as: 'DireccionEnvio', foreignKey: 'direccion_envio_id' });

module.exports = NotaVenta