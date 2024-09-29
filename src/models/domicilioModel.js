const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Cliente = require('./clienteModel');

//Definicion del modelo de domicilio (tabla)
const Domicilio = sequelize.define('Domicilio', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        reference: {
            model: Cliente,
            key: 'id'
        },
        //Si se elimina|actualiza un cliente se elimina|Actualiza sus domicilios
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    domicilio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    colonia: {
        type: DataTypes.STRING,
        allowNull: false
    },
    municipio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo_direccion: {
        type: DataTypes.ENUM('FACTURACION','ENVIO'),
        allowNull: false
    }
}, {
    tableName: 'domicilios',
    timestamps: false
});

//Definir relaciones
Cliente.hasMany(Domicilio, {foreignKey: 'cliente_id'});
Domicilio.belongsTo(Cliente, {foreignKey: 'cliente_id'});

module.exports = Domicilio;