/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
        table.increments('user_id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.enum('role', ['admin','father','mother']).notNullable();
        table.integer('city_id').unsigned().nullable().references('city_id').inTable('cities').onDelete('SET NULL');
        table.enum('level', ['حمل', 'ولادة','السنة الأولى من طفلك','السنة الثانية من طفلك']).notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
