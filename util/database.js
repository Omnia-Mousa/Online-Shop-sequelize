const Sequelize = require('sequelize');

const sequelize = new Sequelize('Small-Projects','omnia','omnia123', {
        host: 'localhost',
        dialect: 'mssql' 
})

module.exports = sequelize;