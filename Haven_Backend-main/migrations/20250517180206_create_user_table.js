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
        
        // إضافة عمود لتخزين تاريخ آخر دورة شهرية
        table.date('last_period_date').nullable(); // يمكن أن يكون فارغاً
        
        // إضافة عمود لتخزين شهر الحمل (إذا كان المستخدم في مرحلة حمل)
        table.integer('pregnancy_month').nullable(); // يمكن أن يكون فارغاً، ويخزن الشهر كرقم (1-9)
        
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
