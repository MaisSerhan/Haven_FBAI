/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('doctors', function(table) {
        table.increments('doctor_id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable().unique();
        table.string('phone').notNullable();
        table.string('password').notNullable();
        table.enu('major', ['نسائية وتوليد', 'طبيب أطفال']).notNullable();
        table.string('location').notNullable();
        table.integer('city_id').unsigned().nullable().references('city_id').inTable('cities').onDelete('set null');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('doctors');
};
