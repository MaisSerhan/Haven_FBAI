/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable('vaccines', function(table) {
        table.increments('vaccine_id').primary();
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.timestamps(true, true);
    });

    await knex('vaccines').insert([
        { name: 'الولادة - لقاح السل (BCG)', description: 'عند الولادة' },
        { name: 'الولادة - شلل الأطفال الفموي (OPV0)', description: 'عند الولادة' },
        { name: '6 أسابيع - شلل الأطفال الفموي (OPV1)', description: 'عمر 6 أسابيع' },
        { name: '6 أسابيع - اللقاح الخماسي (Penta1)', description: 'عمر 6 أسابيع' },
        { name: '10 أسابيع - شلل الأطفال الفموي (OPV2)', description: 'عمر 10 أسابيع' },
        { name: '10 أسابيع - اللقاح الخماسي (Penta2)', description: 'عمر 10 أسابيع' },
        { name: '14 أسبوع - شلل الأطفال الفموي (OPV3)', description: 'عمر 14 أسبوع' },
        { name: '14 أسبوع - اللقاح الخماسي (Penta3)', description: 'عمر 14 أسبوع' },
        { name: '9 أشهر - لقاح الحصبة (Measles1)', description: 'عمر 9 أشهر' },
        { name: '15 شهر - الجرعة الثانية من الحصبة (Measles2)', description: 'عمر 15 شهر' }
    ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('vaccines');
};
