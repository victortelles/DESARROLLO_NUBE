//Libreria
const { Sequelize } = require('sequelize');

// Cargar variables de entorno
require('dotenv').config();

// Crear la conexión a la base de datos
const sequelize = new Sequelize(
    process.env.DB_NAME || exampracticords,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false, //logs
        dialectOptions: {
            connectTimeout: 10000
        }
    }
);

// Probar la conexión a la base de datos
sequelize.authenticate()
    .then(() => {
        console.log('Conexión establecida exitosamente con la base de datos.');

        // Crear la base de datos si no existe
        return sequelize.query('CREATE DATABASE IF NOT EXISTS exampracticords;');
    })
    .then(() => {
        console.log('Base de datos creada exitosamente.');

        // Sincronizar los modelos/tablas con la base de datos
        return sequelize.sync({ force: false });
    })
    .then(() => {
        console.log('Tablas creadas exitosamente.');
    })
    .catch((error) => {
        console.error('Error al conectar o crear la base de datos:', error);
    });

module.exports = sequelize;
