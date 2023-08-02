const config = require('../../../knexfile');
const knex = require('knex');
const sqlConnection = knex(config.development);

module.exports = sqlConnection;