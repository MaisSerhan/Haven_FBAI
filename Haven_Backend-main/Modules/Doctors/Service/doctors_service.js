const { DOCTORS, FILES} = require('../../Constant/Db_tables');
const db = require('../../Constant/db_configuration');

const addDoctor = async (name, email, hashedPassword, city_id, phone, major, location, doctor_image) => {
    return await db.transaction(async trx => {
        const existingDoctor = await trx(DOCTORS).where('email', email).first();
        if (existingDoctor) {
            throw new Error('البريد الإلكتروني موجود بالفعل');
        }

        await trx(DOCTORS).insert({
            name,
            email,
            password: hashedPassword,
            city_id,
            phone,
            major,
            location
        });

        const newDoctor = await trx(DOCTORS).where('email', email).first();

        await trx(FILES).insert({
            file_name: doctor_image.file_name,
            file_path: doctor_image.file_path,
            description: doctor_image.description,
            owner_type: "doctor",
            owner_id: newDoctor.doctor_id
        });

        const { password: _, ...safeDoctor } = newDoctor;
        return safeDoctor;
    });
}

const updateDoctorService = async (doctor_id, updatedFields, doctor_image) => {
    return await db.transaction(async trx => {
        const doctor = await trx(DOCTORS).where({ doctor_id }).first();
        if (!doctor) {
            throw new Error("الدكتور غير موجود");
        }
        await trx(DOCTORS).where({ doctor_id }).update(updatedFields);

        if (doctor_image) {
            await trx(FILES).where({
                owner_type: 'doctor',
                owner_id: doctor_id
            }).del();

            await trx(FILES).insert({
                file_name: doctor_image.file_name,
                file_path: doctor_image.file_path,
                description: doctor_image.description,
                owner_type: "doctor",
                owner_id: doctor_id
            });
        }

        const updatedDoctor = await trx(DOCTORS).where({ doctor_id }).first();
        const { password, ...safeDoctor } = updatedDoctor;
        return safeDoctor;
    });
};

const deleteDoctorById = async (doctor_id) => {
    return await db.transaction(async (trx) => {
        const doctor = await trx(DOCTORS).where("doctor_id", doctor_id).first();
        if (!doctor) {
            return false;
        }

        await trx(FILES)
            .where({
                owner_type: "doctor",
                owner_id: doctor_id,
            })
            .del();

        await trx(DOCTORS).where("doctor_id", doctor_id).del();

        return true;
    });
};

const getDoctorsService = async ({ name, city_id, major, location }) => {
        return await db(DOCTORS)
            .modify(query => {
                if (name) {
                    query.whereILike('name', `%${name}%`);
                }
                if (city_id) {
                    query.where('city_id', city_id);
                }
                if (major) {
                    query.whereILike('major', `%${major}%`);
                }
                if (location) {
                    query.whereILike('location', `%${location}%`);
                }
            });
    };

module.exports = {
    addDoctor,
    updateDoctorService,
    deleteDoctorById,
    getDoctorsService
};