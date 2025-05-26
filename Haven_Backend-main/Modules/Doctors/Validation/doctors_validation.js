const {body , param} = require('express-validator');
const db = require("../../Constant/db_configuration");
const {CITIES , DOCTORS , USERS} = require("../../Constant/Db_tables");

const name = body('name').notEmpty().withMessage('الاسم مطلوب').isString().withMessage('الاسم يجب أن يكون نصا')
const email = body('email').notEmpty().withMessage('البريد الإلكتروني مطلوب').bail()
    .isEmail().withMessage('صيغة البريد الإلكتروني غير صحيحة').bail()
    .custom(async (value) => {
        const emailIsExistInUser = await db(USERS).where('email', value).first();
        const emailIsExistInDoctor = await db(DOCTORS).where('email', value).first();
        if (emailIsExistInUser || emailIsExistInDoctor) {
            return Promise.reject('البريد الإلكتروني موجود بالفعل، يرجى اختيار بريد إلكتروني آخر');
        }
        return Promise.resolve();
    });
    const phone = body('phone')
    .notEmpty()
    .withMessage('رقم الهاتف مطلوب')
    .bail()
    .isLength({ min: 10, max: 10 })
    .withMessage('رقم الهاتف يجب ان يكون 10 أرقام');

const password = body('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة')
    .bail()
    .isLength({ min: 6 })
    .withMessage('كلمة المرور يجب أن تكون على الأقل 6 حروف');

const confirmPassword = body('confirmPassword')
    .notEmpty()
    .withMessage('تأكيد كلمة المرور مطلوب')
    .bail()
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('كلمة المرور غير متطابقة');
        }
        return true;
    });

const city_id = body('city_id')
    .notEmpty()
    .withMessage('المدينة مطلوبة')
    .bail()
    .isInt()
    .withMessage('معرف المدينة يجب ان يكون رقم صحيح')
    .custom(async (value) => {
        const city = await db(CITIES).where('city_id', value).first();
        if (!city) {
            throw new Error('المدينة غير موجودة');
        }
        return true;
    });

const major = body('major')
    .notEmpty()
    .withMessage('التخصص مطلوب')
    .bail()
    .isIn(['نسائية وتوليد','طبيب أطفال'])
    .withMessage('يجب ان يكون التخصص نسائية وتوليد او طبيب أطفال');

const location = body('location')
    .notEmpty()
    .withMessage('موقع العيادة مطلوب')
    .bail()
    .isString()
    .withMessage('موقع العيادة يجب ان يكون نصاً');

const updateDoctorValidation = [
    body('name')
        .optional()
        .isString().withMessage('الاسم يجب أن يكون نصاً'),

    body('email')
        .optional()
        .isEmail().withMessage('صيغة البريد الإلكتروني غير صحيحة')
        .bail()
        .custom(async (value, { req }) => {
            const doctorId = req.user.role === 'doctor'
                ? req.user.user_id
                : req.params.doctor_id;            const existingUser = await db(USERS).where('email', value).first();
            const existingDoctor = await db(DOCTORS)
                .where('email', value)
                .whereNot('doctor_id', doctorId)
                .first();

            if (existingUser || existingDoctor) {
                throw new Error('البريد الإلكتروني مستخدم بالفعل');
            }

            return true;
        }),

    body('password')
        .optional()
        .isLength({ min: 6 }).withMessage('كلمة المرور يجب أن تكون على الأقل 6 حروف'),

    body('city_id')
        .optional()
        .isInt().withMessage('معرف المدينة يجب أن يكون رقم صحيح')
        .bail()
        .custom(async (value) => {
            const city = await db(CITIES).where('city_id', value).first();
            if (!city) throw new Error('المدينة غير موجودة');
            return true;
        }),

    body('major')
        .optional()
        .isIn(['نسائية وتوليد', 'طبيب أطفال']).withMessage('تخصص غير صالح'),

    body('location')
        .optional()
        .isString().withMessage('موقع العيادة يجب أن يكون نصاً'),
];

const doctor_id = param('doctor_id')
    .notEmpty()
    .withMessage('معرف الطبيب مطلوب')
    .bail()
    .isInt()
    .withMessage('معرف الطبيب يجب ان يكون رقم صحيح')
    .custom(async (value) => {
        const doctor = await db(DOCTORS).where('doctor_id', value).first();
        if (!doctor) {
            throw new Error('الطبيب غير موجود');
        }
        return true;
    });

const addDoctor = [name , email , password , confirmPassword ,phone , city_id , major , location]
const getDoctorById = [doctor_id]
module.exports = {
    addDoctor , updateDoctorValidation, getDoctorById
}