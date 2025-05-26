/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('user_vaccines', function(table) {
        table.increments('user_vaccines_id').primary();
        table.integer('user_id').unsigned().notNullable().references('user_id').inTable('users').onDelete('CASCADE');
        table.integer('vaccine_id').unsigned().notNullable().references('vaccine_id').inTable('vaccines').onDelete('CASCADE');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('user_vaccines');
};
