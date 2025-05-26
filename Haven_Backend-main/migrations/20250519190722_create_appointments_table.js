/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('appointments', function(table) {
        table.increments('appointment_id').primary();

        table.integer('doctor_id').unsigned().notNullable()
            .references('doctor_id').inTable('doctors')
            .onDelete('CASCADE');

        table.integer('user_id').unsigned().notNullable()
            .references('user_id').inTable('users')
            .onDelete('CASCADE');

        table.string('user_name').notNullable();
        table.string('phone').notNullable();

        table.date('appointment_date').notNullable();
        table.time('appointment_time').notNullable();
        table.timestamps(true, true);

        table.unique(['doctor_id', 'appointment_date', 'appointment_time']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('appointments');
};
