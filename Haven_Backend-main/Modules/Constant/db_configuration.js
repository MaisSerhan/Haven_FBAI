const knex = require('knex');
const knexconfig = require('../../knexfile');
const db = knex(knexconfig.development);

module.exports = db;
