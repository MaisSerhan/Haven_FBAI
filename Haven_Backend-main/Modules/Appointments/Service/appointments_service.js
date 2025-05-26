const db = require('../../Constant/db_configuration');
const { APPOINTMENTS, DOCTORS} = require('../../Constant/Db_tables');

const addNewAppointment = async (user_id, user_name, phone, doctor_id, appointment_date, appointment_time) => {
    try {
        return await db(APPOINTMENTS).insert({user_id, user_name, phone, doctor_id, appointment_date, appointment_time});
    } catch (error) {
        throw error;
    }
};

const deleteAppointmentService = async (appointment_id) => {
    try {
        return await db(APPOINTMENTS).where('appointment_id', appointment_id).delete();
    } catch (error) {
        throw error;
    }
};

const updateAppointmentService = async (appointment_id, user_name, phone, doctor_id, appointment_date, appointment_time) => {
    try {
        return await db(APPOINTMENTS).where('appointment_id', appointment_id).update({user_name, phone, doctor_id, appointment_date, appointment_time});
    } catch (error) {
        throw error;
    }
}

const UserAppointments = async (user_id, doctor_id) => {
    const query = db(APPOINTMENTS)
        .join(DOCTORS, `${APPOINTMENTS}.doctor_id`, '=', `${DOCTORS}.doctor_id`)
        .select(
            `${APPOINTMENTS}.*`,
            `${DOCTORS}.name as doctor_name`,
            `${DOCTORS}.major as doctor_major`
        );

    if (user_id) {
        query.where(`${APPOINTMENTS}.user_id`, user_id);
    }

    if (doctor_id) {
        query.where(`${APPOINTMENTS}.doctor_id`, doctor_id);
    }

    return await query;
};




module.exports = {
    addNewAppointment,
    deleteAppointmentService,
    updateAppointmentService,
    UserAppointments
}