const  { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

//Definicion del modelo de Producto (tabla)
const Producto = sequelize.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    unidad_medida: {
        type: DataTypes.STRING,
        allowNull: false
    },
    precio_base: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'productos',
    timestamps: false
});

module.exports = Producto;