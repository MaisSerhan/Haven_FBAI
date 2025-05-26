/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('files', function(table) {
        table.increments('file_id').primary();
        table.string('file_name').notNullable();
        table.string('file_path').notNullable();
        table.boolean('is_external').notNullable().defaultTo(false);
        table.text('description').nullable();
        table.enum('owner_type', ['user', 'doctor'])
        table.integer('owner_id').notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('files');
};
