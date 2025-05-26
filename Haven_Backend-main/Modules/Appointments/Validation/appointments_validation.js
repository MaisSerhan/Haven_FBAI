const {body, param} = require('express-validator');
const db = require('../../Constant/db_configuration');
const {DOCTOR_WEEKLY_SCHEDULE, APPOINTMENTS, DOCTORS, USERS} = require('../../Constant/Db_tables');
const dayjs = require('dayjs');

const user_name = body('user_name')
    .notEmpty().withMessage('اسم المريض مطلوب')
    .isString().withMessage('اسم المريض يجب أن يكون نصاً');

const phone = body('phone')
    .notEmpty().withMessage('رقم الهاتف مطلوب')
    .isMobilePhone('any').withMessage('رقم الهاتف غير صالح');

const doctor_id = body('doctor_id')
    .optional()
    .notEmpty().withMessage('معرف الطبيب مطلوب')
    .isInt().withMessage('معرف الطبيب يجب أن يكون رقماً صحيحاً')
    .custom(async (value) => {
        const doctor = await db(DOCTORS).where({doctor_id: value}).first();
        if (!doctor) throw new Error('الطبيب غير موجود');
        return true;
    });

const appointment_date = body('appointment_date')
    .notEmpty().withMessage('تاريخ الحجز مطلوب')
    .isISO8601().withMessage('تاريخ غير صالح');

const appointment_time = body('appointment_time')
    .notEmpty().withMessage('الوقت مطلوب')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('الوقت غير صالح (HH:mm)')
    .custom(async (value, {req}) => {
        const { appointment_date} = req.body;
        const doctor_id = req.user.role === 'doctor' ? req.user.user_id : req.body.doctor_id;

        if (!doctor_id || !appointment_date) return true;

        // البحث عن بداية الأسبوع حسب جدول مواعيد الطبيب الذي يحتوي تاريخ بدء الأسبوع
        const scheduleRecord = await db(DOCTOR_WEEKLY_SCHEDULE)
            .where('doctor_id', doctor_id)
            .andWhere('week_start_date', '<=', appointment_date)
            .andWhereRaw("DATE_ADD(week_start_date, INTERVAL 6 DAY) >= ?", [appointment_date])
            .first();

        if (!scheduleRecord) {
            throw new Error('جدول مواعيد الطبيب لهذا الأسبوع غير موجود');
        }

        // هون بنحسب الفرق بين يوم بداية الأسبوع وتاريخ الموعد بالعدد الأيام.
        const weekStart = dayjs(scheduleRecord.week_start_date);
        const appointmentDay = dayjs(appointment_date);
        const weekday = appointmentDay.diff(weekStart, 'day');

        // جلب جدول اليوم المحدد حسب اليوم النسبي
        const schedule = await db(DOCTOR_WEEKLY_SCHEDULE)
            .where({
                doctor_id,
                week_start_date: scheduleRecord.week_start_date,
                weekday
            })
            .first();

        if (!schedule || !schedule.is_available) {
            throw new Error('الطبيب غير متاح في هذا اليوم');
        }

        // التحقق من الوقت ضمن فترة دوام الطبيب
        if (value < schedule.start_time || value >= schedule.end_time) {
            throw new Error('الوقت خارج فترة العمل للطبيب');
        }
        //  جلب مدة الجلسة من نفس سجل الجدول
        const sessionDuration = schedule.session_duration || 30;

        const requestedStart = dayjs(`${appointment_date} ${value}`);
        const requestedEnd = requestedStart.add(sessionDuration, 'minute');

        //  التحقق من تداخل الموعد مع أي موعد حالي
        const conflicts = await db(APPOINTMENTS)
            .where('doctor_id', doctor_id)
            .andWhere('appointment_date', appointment_date)
            .where(function () {
                this.whereRaw(`TIME(appointment_time) < ?`, [requestedEnd.format("HH:mm")])
                    .andWhereRaw(`ADDTIME(appointment_time, SEC_TO_TIME(? * 60)) > ?`, [sessionDuration, value]);
            });

        if (conflicts.length > 0) {
            throw new Error('يوجد جلسة أخرى متداخلة مع هذا الوقت');
        }

        return true;
    });

const appointmentId = param('appointment_id')
    .isInt().withMessage('معرف الموعد يجب ان يكون رقم صحيح')
    .custom(async (value) => {
        const appointment = await db(APPOINTMENTS).where('appointment_id', value).first();
        if (!appointment) throw new Error('الموعد غير موجود');
        return true;
    });

const { query } = require('express-validator');

const validateQuery = [
    query('user_id')
        .optional()
        .isInt().withMessage('user_id يجب أن يكون رقم صحيح'),

    query('doctor_id')
        .optional()
        .isInt().withMessage('doctor_id يجب أن يكون رقم صحيح')
];



const getAppointmentId = [appointmentId]
const updateAppointmentValidation = [appointmentId, user_name, phone, doctor_id, appointment_date, appointment_time];
const appointmentValidation = [user_name, phone, doctor_id, appointment_date, appointment_time];
module.exports = {
    appointmentValidation, getAppointmentId, updateAppointmentValidation ,validateQuery
};
