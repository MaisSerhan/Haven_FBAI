const {addNewAppointment,deleteAppointmentService,updateAppointmentService,UserAppointments} = require('../Service/appointments_service');

// const addAppointment = async (req, res) => {
//     try {
//         const {user_id} = req.user;
//         const {user_name, phone, appointment_date, appointment_time} = req.body;
//
//         if(req.user.role === 'user') {
//             const {doctor_id} = req.body;
// }
// else if (req.user.role === 'doctor') {
//
// }
//
//         const result = await addNewAppointment(user_id, user_name, phone, doctor_id, appointment_date, appointment_time);
//
//         return res.status(200).json({
//             result,
//             message: 'تم حجز الموعد بنجاح'
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: 'فشل في حجز الموعد',
//             error: error.message || error
//         });
//     }
// };

const addAppointment = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        const { user_name, phone, appointment_date, appointment_time, doctor_id: bodyDoctorId } = req.body;
        console.log(req.user)
        let doctor_id = null;
        let final_user_id = null;

        if (role === 'mother' || role === 'father') {
            doctor_id = bodyDoctorId;
            final_user_id = user_id;
        } else if (role === 'doctor') {
            doctor_id = user_id;
            final_user_id = null;
        } else {
            return res.status(403).json({ message: 'غير مصرح لك بحجز موعد' });
        }

        const result = await addNewAppointment(
            final_user_id,
            user_name,
            phone,
            doctor_id,
            appointment_date,
            appointment_time
        );

        return res.status(200).json({
            message: 'تم حجز الموعد بنجاح',
            result
        });

    } catch (error) {
        return res.status(500).json({
            message: 'فشل في حجز الموعد',
            error: error.message || error
        });
    }
};

const deleteAppointment = async (req, res) => {
    const {appointment_id} = req.params;
    try {
        await deleteAppointmentService(appointment_id);
        return res.status(200).json({message: "تم حذف الموعد بنجاح."});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const updateAppointment = async (req, res) => {
    const {appointment_id} = req.params;
    const {user_name, phone, doctor_id, appointment_date, appointment_time} = req.body;
    try {
        await updateAppointmentService(appointment_id, user_name, phone, doctor_id, appointment_date, appointment_time);
        return res.status(200).json({message: "تم تحديث الموعد بنجاح."});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const getAppointments = async (req, res) => {
    const {user_id , doctor_id} = req.query;
    try {
        const appointments = await UserAppointments(user_id , doctor_id);
        return res.status(200).json({appointments});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}
module.exports = {
    addAppointment,
    deleteAppointment,
    updateAppointment,
    getAppointments
}