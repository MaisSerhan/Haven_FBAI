const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable('medical_clinics', function(table) {
        table.increments('medical_clinics_id').primary();
        table.string('name').notNullable();
        table.string('address').notNullable();
        table.string('phone').notNullable();
        table.string('specialization').notNullable();
        table.integer('city_id').unsigned().references('city_id').inTable('cities').onDelete('CASCADE');
        table.timestamps(true, true);
    });

    const clinics = [];
    const csvFilePath = path.join(__dirname, '..', 'medical_clinics.csv');

    return new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                clinics.push({
                    name: row.name?.trim(),
                    address: row.address?.trim(),
                    phone: row.phone?.trim(),
                    specialization: row.specialization?.trim(),
                    city_id: Number(row.city_id) || null
                });
            })
            .on('end', async () => {
                if (clinics.length === 0) {
                    console.error('❌ CSV file is empty.');
                    return reject(new Error('CSV file is empty.'));
                }

                try {
                    for (const clinic of clinics) {
                        const existingClinic = await knex('medical_clinics')
                            .where('name', clinic.name)
                            .first();

                        if (!existingClinic) {
                            await knex('medical_clinics').insert(clinic);
                        }
                    }

                    console.log('✅ Medical clinics inserted successfully.');
                    resolve();
                } catch (error) {
                    console.error('❌ Error inserting clinics:', error);
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error('❌ Error reading CSV:', error);
                reject(error);
            });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTable('medical_clinics');
};
