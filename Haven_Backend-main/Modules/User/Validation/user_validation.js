const {body , param} = require('express-validator');
const {USERS, CITIES} = require("../../Constant/Db_tables");
const db = require("../../Constant/db_configuration");

const name = body('name').notEmpty().withMessage('الاسم مطلوب').isString();
const email = body('email').notEmpty().withMessage('الايميل مطلوب').isEmail().custom(async (value)=>{
        const emailIsExist =await db(USERS).where('email' , value).first();
        if (emailIsExist) {
            return Promise.reject('الايميل موجود بالفعل, يرجى اختيار ايميل اخر');
        }

        return Promise.resolve();
    })
const password = body('password').notEmpty().withMessage('كلمة المرور مطلوبة').isLength({min: 6}).withMessage('كلمة المرور يجب ان تكون على الاقل 6 ارقام')

const user_id = param('user_id').isInt().withMessage('معرف المستخدم يجب ان يكون رقم صحيح')
    .custom(async (value) => {
        const user = await db(USERS).where('user_id', value).first();
        if (!user) {
            throw new Error('المستخدم غير موجود');
        }
        return true;
    })

const newPassword = body('newPassword').notEmpty().withMessage('كلمة المرور الجديدة مطلوبة')
    .isLength({min: 6}).withMessage('كلمة المرور يجب ان تكون على الاقل 6 ارقام');

const confirmPassword = body('confirmPassword').notEmpty().withMessage('تاكيد كلمة المرور مطلوبة')
    .custom((value, {req}) => {
        if(req.method === 'POST'){
            if (value !== req.body.password) {
                throw new Error('كلمة المرور غير متطابقة');
            }
            return true;
        }
        if (value !== req.body.newPassword) {
            throw new Error('كلمة المرور غير متطابقة');
        }
        return true;
    });

const searchEmail = body('email')
    .notEmpty()
    .withMessage('البريد الإلكتروني مطلوب')
    .custom(async (value) => {
        const user = await db(USERS).where({email: value}).first();
        console.log(user);
        if (!user) {
            return Promise.reject('البريد الإلكتروني غير موجود');
        }
        return Promise.resolve();
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


const role = body('role')
    .notEmpty()
    .withMessage('الدور مطلوبة')
    .bail()
    .isIn(['father', 'mother','admin'])
    .withMessage('يجب ان يكون الدور father او mother او admin');

const level = body('level')
    .if(body('role').not().equals('admin'))
    .notEmpty()
    .withMessage('المستوى مطلوب')
    .bail()
    .isIn(['حمل', 'ولادة','السنة الأولى من طفلك','السنة الثانية من طفلك'])
    .withMessage('يجب ان يكون المستوى حمل او ولادة او السنة الأولى من طفلك او السنة الثانية من طفلك');

const updateUserInformation = [
    param('user_id').isInt().withMessage('معرف المستخدم يجب أن يكون رقم صحيح'),

    body('name').optional().isString().withMessage('الاسم يجب أن يكون نصاً'),

    body('email').optional()
        .isEmail().withMessage('الايميل غير صالح')
        .custom(async (value, { req }) => {
            const user = await db(USERS).where('email', value).first();
            if (user && user.user_id !== parseInt(req.params.user_id)) {
                return Promise.reject('الايميل مستخدم من قبل مستخدم اخر');
            }
            return true;
        }),

    body('city_id').optional()
        .isInt().withMessage('معرف المدينة يجب أن يكون رقم صحيح')
        .custom(async (value) => {
            const city = await db(CITIES).where('city_id', value).first();
            if (!city) {
                throw new Error('المدينة غير موجودة');
            }
            return true;
        }),

    body('role').optional()
        .isIn(['father', 'mother', 'admin'])
        .withMessage('يجب ان يكون الدور father او mother او admin'),

    body('level').optional()
        .custom((value, { req }) => {
            if (req.body.role === 'admin') return true;
            const validLevels = ['حمل', 'ولادة', 'السنة الأولى من طفلك', 'السنة الثانية من طفلك'];
            if (!validLevels.includes(value)) {
                throw new Error('يجب ان يكون المستوى حمل او ولادة او السنة الأولى من طفلك او السنة الثانية من طفلك');
            }
            return true;
        }),
];

const getUserID = [user_id];
const changePassword = [user_id, password, newPassword, confirmPassword];
const userGetEmailValidation = [searchEmail]
const resetPasswordValidation = [newPassword , confirmPassword]
const userValidation = [name, email, password, confirmPassword, city_id, level, role];


module.exports = {
    userValidation ,getUserID , updateUserInformation , changePassword , userGetEmailValidation
    ,resetPasswordValidation
}