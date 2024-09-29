const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
});

// Función para ejecutar consultas
const executeQuery = async (query, params = []) => {
    try {
        const [results] = await sequelize.query(query, {
            replacements: params,
        });
        return results;
    } catch (error) {
        console.error('Error en la consulta a RDS:', error);
        throw error;
    }
};

// Exportar las funciones necesarias
module.exports = {
    executeQuery,
};