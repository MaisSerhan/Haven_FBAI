/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.alterTable('appointments', function(table) {
        table.dropForeign('user_id');
    });

    await knex.schema.alterTable('appointments', function(table) {
        table.integer('user_id').unsigned().nullable().alter();
        table.foreign('user_id').references('users.user_id').onDelete('SET NULL');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.alterTable('appointments', function(table) {
        table.dropForeign('user_id');
    });

    await knex.schema.alterTable('appointments', function(table) {
        table.integer('user_id').unsigned().notNullable().alter();
        table.foreign('user_id').references('users.user_id').onDelete('CASCADE');
    });
};
