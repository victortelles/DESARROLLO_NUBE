//Librerias
const { DataTypes }= require ('sequelize');
//Instancia de Sequelize que se conecta con RDS.
const sequelize = require('../config/db');

//Definicion del modelo del cliente (tabla)
const Cliente = sequelize.define('Cliente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    razon_social: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre_comercial: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correo_electronico: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    }
}, {
    tableName: 'clientes',
    timestamps: false
});

module.exports = Cliente;