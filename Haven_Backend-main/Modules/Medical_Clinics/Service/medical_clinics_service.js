const db = require('../../Constant/db_configuration');
const {MEDICAL_CLINICS} = require('../../Constant/Db_tables');

const NewMedicalClinic = async (name, address, phone, specialization, city_id) => {
    try {
        return await db(MEDICAL_CLINICS).insert({name, address, phone, specialization, city_id});
    } catch (error) {
        return error;
    }
}

const AllMedicalClinics = async (limit, offset) => {
    try {
        const clinics = await db(MEDICAL_CLINICS)
            .select('*')
            .limit(limit)
            .offset(offset);

        const [{ count }] = await db(MEDICAL_CLINICS).count('* as count');

        return {
            clinics,
            total: parseInt(count)
        };
    } catch (error) {
        throw new Error('فشل في جلب جميع العيادات من قاعدة البيانات');
    }
};
const getMedical = async (medical_clinic_id) => {
    try {
        return await db(MEDICAL_CLINICS).where('medical_clinics_id', medical_clinic_id).first();
    } catch (error) {
        return error;
    }
}

const deleteMedical = async (medical_clinic_id) => {
    try {
        return await db(MEDICAL_CLINICS).where('medical_clinics_id', medical_clinic_id).delete();
    } catch (error) {
        return error;
    }
}

const updateMedical = async (medical_clinic_id, name, address, phone, specialization, city_id) => {
    try {
        return await db(MEDICAL_CLINICS).where('medical_clinics_id', medical_clinic_id).update({
            name,
            address,
            phone,
            specialization,
            city_id
        });
    } catch (error) {
        return error;
    }
}

const AllMedicalClinicsByCity = async (city_id, limit, offset) => {
    try {
        const clinics = await db(MEDICAL_CLINICS)
            .where('city_id', city_id)
            .select('*')
            .limit(limit)
            .offset(offset);

        const [{ count }] = await db(MEDICAL_CLINICS)
            .where('city_id', city_id)
            .count('* as count');

        return {
            clinics,
            total: parseInt(count)
        };
    } catch (error) {
        throw new Error('فشل في جلب العيادات حسب المدينة من قاعدة البيانات');
    }
};

const AllMedicalClinicsByName = async (name, limit, offset) => {
    try {
        const clinics = await db(MEDICAL_CLINICS)
            .where('name', 'like', `%${name}%`)
            .select('*')
            .limit(limit)
            .offset(offset);

        const [{ count }] = await db(MEDICAL_CLINICS)
            .where('name', 'like', `%${name}%`)
            .count('* as count');

        return {
            clinics,
            total: parseInt(count)
        };
    } catch (error) {
        throw new Error('فشل في جلب العيادات حسب الاسم من قاعدة البيانات');
    }
};

module.exports = {
    NewMedicalClinic, AllMedicalClinics, getMedical,
    deleteMedical, updateMedical, AllMedicalClinicsByCity, AllMedicalClinicsByName
}