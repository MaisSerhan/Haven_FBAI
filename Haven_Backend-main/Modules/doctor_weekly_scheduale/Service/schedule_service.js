const db = require('../../Constant/db_configuration');
const {DOCTOR_WEEKLY_SCHEDULE} = require("../../Constant/Db_tables");

// const saveWeeklySchedule = async ({ doctor_id, week_start_date, schedule }) => {
//     const trx = await db.transaction();
//     try {
//         for (const day of schedule) {
//             const existing = await trx(DOCTOR_WEEKLY_SCHEDULE)
//                 .where({
//                     doctor_id,
//                     week_start_date,
//                     weekday: day.weekday
//                 })
//                 .first();
//
//             const dayData = {
//                 doctor_id,
//                 week_start_date,
//                 weekday: day.weekday,
//                 is_available: day.is_available,
//                 start_time: day.is_available ? day.start_time : null,
//                 end_time: day.is_available ? day.end_time : null,
//                 session_duration: day.is_available ? day.session_duration : null,
//             };
//
//             if (existing) {
//                 await trx(DOCTOR_WEEKLY_SCHEDULE)
//                     .where({ schedule_id: existing.schedule_id })
//                     .update(dayData);
//             } else {
//                 await trx(DOCTOR_WEEKLY_SCHEDULE)
//                     .insert(dayData);
//             }
//         }
//         await trx.commit();
//     } catch (error) {
//         await trx.rollback();
//         throw error;
//     }
// };

const deleteScheduleService = async (doctor_id ) => {
    return await db(DOCTOR_WEEKLY_SCHEDULE).where('doctor_id', doctor_id).del();
}

const getSchedulesService = async ({ doctor_id, doctor_name, week_start_date, start_date, end_date, is_available }) => {
    const query = db(DOCTOR_WEEKLY_SCHEDULE)
        .select(
            'doctor_weekly_schedule.schedule_id',
            'doctor_weekly_schedule.doctor_id',
            'doctors.name as doctor_name',
            'doctor_weekly_schedule.week_start_date',
            'doctor_weekly_schedule.weekday',
            'doctor_weekly_schedule.is_available',
            'doctor_weekly_schedule.start_time',
            'doctor_weekly_schedule.end_time',
            'doctor_weekly_schedule.session_duration',
            'doctor_weekly_schedule.created_at',
            'doctor_weekly_schedule.updated_at'
        )
        .join('doctors', 'doctors.doctor_id', 'doctor_weekly_schedule.doctor_id');

    if (doctor_id) {
        query.where('doctor_weekly_schedule.doctor_id', doctor_id);
    }

    if (doctor_name) {
        query.whereILike('doctors.name', `%${doctor_name}%`);
    }

    if (week_start_date) {
        query.where('doctor_weekly_schedule.week_start_date', week_start_date);
    }

    if (start_date && end_date) {
        query.whereBetween('doctor_weekly_schedule.week_start_date', [start_date, end_date]);
    }

    if (typeof is_available !== 'undefined') {
        const available = is_available === 'true' || is_available === true;
        query.where('doctor_weekly_schedule.is_available', available);
    }

    return await query.orderBy([
        { column: 'doctor_weekly_schedule.week_start_date', order: 'desc' },
        { column: 'doctor_weekly_schedule.weekday', order: 'asc' }
    ]);
};

const saveWeeklySchedule = async ({ doctor_id, week_start_date, schedule }) => {
    const trx = await db.transaction();
    try {
        await trx(DOCTOR_WEEKLY_SCHEDULE)
            .where({ doctor_id })
            .del();

        for (const day of schedule) {
            const dayData = {
                doctor_id,
                week_start_date,
                weekday: day.weekday,
                is_available: day.is_available,
                start_time: day.is_available ? day.start_time : null,
                end_time: day.is_available ? day.end_time : null,
                session_duration: day.is_available ? day.session_duration : null,
            };

            await trx(DOCTOR_WEEKLY_SCHEDULE).insert(dayData);
        }

        await trx.commit();
    } catch (error) {
        await trx.rollback();
        throw error;
    }
};


module.exports = {
    saveWeeklySchedule, deleteScheduleService, getSchedulesService
};