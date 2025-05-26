// 20250519183000_create_doctor_weekly_schedule.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('doctor_weekly_schedule', function(table) {
        table.increments('schedule_id').primary();
        table.integer('doctor_id').unsigned().notNullable()
            .references('doctor_id').inTable('doctors')
            .onDelete('CASCADE');
        table.date('week_start_date').notNullable();
        table.integer('weekday').notNullable();
        table.boolean('is_available').notNullable();
        table.time('start_time').nullable();
        table.time('end_time').nullable();
        table.integer('session_duration').nullable();
        table.timestamps(true, true);

        table.unique(['doctor_id', 'week_start_date', 'weekday']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('doctor_weekly_schedule');
};
