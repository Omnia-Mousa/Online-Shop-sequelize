const Sequqlize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {

    id: {
        type: Sequqlize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequqlize.STRING,
        allowNull: false
    },
    email: {
        type: Sequqlize.STRING,
        allowNull: false
    }
});

module.exports = User;