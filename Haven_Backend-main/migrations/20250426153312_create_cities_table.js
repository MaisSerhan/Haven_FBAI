/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable('cities', function(table) {
        table.increments('city_id').primary();
        table.string('city_name').notNullable();
        table.timestamps(true, true);
    });

    await knex('cities').insert([
        { city_name: 'رام الله والبيرة' },
        { city_name: 'الخليل' },
        { city_name: 'نابلس' },
        { city_name: 'طولكرم' },
        { city_name: 'بيت لحم' },
        { city_name: 'جنين' },
        { city_name: 'القدس' },
        { city_name: 'أريحا' },
        { city_name: 'طوباس' },
    ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('cities');
};
