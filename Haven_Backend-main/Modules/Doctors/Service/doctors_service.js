const { DOCTORS, FILES} = require('../../Constant/Db_tables'); 
const db = require('../../Constant/db_configuration'); 

const addDoctor = async (name, email, hashedPassword, city_id, phone, major, location, doctor_image) => { 
    return await db.transaction(async trx => { 
        const existingDoctor = await trx(DOCTORS).where('email', email).first(); 
        if (existingDoctor) { 
            throw new Error('البريد الإلكتروني موجود بالفعل'); 
        } 

        const [doctor_id] = await trx(DOCTORS).insert({
            name, 
            email, 
            password: hashedPassword, 
            city_id, 
            phone, 
            major, 
            location 
        }).returning('doctor_id'); 

        let doctor_profile_image_path = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; // Default path for doctor

        if (doctor_image) {
            await trx(FILES).insert({ 
                file_name: doctor_image.file_name, 
                file_path: doctor_image.file_path, 
                description: doctor_image.description, 
                owner_type: "doctor", 
                owner_id: doctor_id 
            }); 
            doctor_profile_image_path = `http://localhost:3001/${doctor_image.file_path.replace(/\\/g, '/')}`; 
        }
        
        const newDoctor = await trx(DOCTORS)
            .leftJoin(FILES, function() {
                this.on(`${DOCTORS}.doctor_id`, '=', `${FILES}.owner_id`)
                    .andOn(`${FILES}.owner_type`, '=', db.raw('?', ['doctor']));
            })
            .select(
                `${DOCTORS}.*`,
                `${FILES}.file_path as profile_image_path` 
            )
            .where(`${DOCTORS}.doctor_id`, doctor_id)
            .first();

        const { password: _, ...safeDoctor } = newDoctor; 
        safeDoctor.profile_image_path = safeDoctor.profile_image_path ? `http://localhost:3001/${safeDoctor.profile_image_path.replace(/\\/g, '/')}` : 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

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

const getDoctorById = async (id) => {
  const doctor = await db('doctors').where('doctor_id', id).first();
  return doctor;
};



module.exports = { 
    addDoctor, 
    updateDoctorService, 
    deleteDoctorById, 
    getDoctorById,
    getDoctorsService 
};
