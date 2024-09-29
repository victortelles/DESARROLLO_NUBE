//Libreria
const { Sequelize } = require('sequelize');

// Cargar variables de entorno
require('dotenv').config();

// Crear la conexión a la base de datos
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false, //logs
    }
);

// Probar la conexión a la base de datos
sequelize.authenticate()
    .then(() => {
        console.log('Conexión establecida exitosamente con la base de datos.');
    })
    .catch(err => {
        console.error('Error al conectarse a la base de datos:', err);
    });

module.exports = sequelize;
