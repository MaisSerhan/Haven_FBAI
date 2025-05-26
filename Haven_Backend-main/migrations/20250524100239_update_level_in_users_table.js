/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    return knex.schema.alterTable('users', function(table) {
        table.enum('level', ['حمل', 'ولادة','السنة الأولى من طفلك','السنة الثانية من طفلك'])
            .nullable()
            .alter();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return knex.schema.alterTable('users', function(table) {
        table.enum('level', ['حمل', 'ولادة','السنة الأولى من طفلك','السنة الثانية من طفلك'])
            .notNullable()
            .alter();
    });
};
