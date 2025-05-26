const {body , param} = require('express-validator');
const db = require("../../Constant/db_configuration");
const {VACCINES, USERS, USER_VACCINES} = require("../../Constant/Db_tables");

const name = body('name').notEmpty().withMessage('الاسم مطلوب').isString();
const description = body('description').notEmpty().withMessage('الوصف مطلوب').isString();
const id = param('vaccine_id').isInt().withMessage('معرف الطعم يجب ان يكون رقم صحيح')
    .custom(async (value) => {
        const existingVaccine =await db(VACCINES).where('vaccine_id', value).first();
        if (!existingVaccine) {
            return Promise.reject('الطعم غير موجود');
        }
        return Promise.resolve();
    })

const user_id = param('user_id')
    .notEmpty().withMessage("معرف المستخدم مطلوب")
    .isInt().withMessage("معرف المستخدم يجب ان يكون رقم صحيح")
    .custom(async (value) => {
        const user = await db(USERS).where('user_id', value).first();
        if (!user) {
            return Promise.reject("المستخدم غير موجود");
        }
        return true;
    });

const getUserVaccineIDValidation = param("user_vaccines_id")
    .isInt().withMessage("معرف سجل المستخدم والطُعم يجب أن يكون رقم صحيح")
    .custom(async (value) => {
        const record = await db(USER_VACCINES).where("user_vaccines_id", value).first();
        if (!record) {
            return Promise.reject("سجل المستخدم والطُعم غير موجود");
        }
        return true;
    });


const getIdValidation = [id]
const createVaccineValidation = [name , description]
const updateVaccineValidation = [id , name , description]
const userVaccineValidation = [user_id, id];
const getUserIdValidation = [user_id]
const userVaccineIdValidation = [getUserVaccineIDValidation]


module.exports = {
    createVaccineValidation ,
    getIdValidation,
    updateVaccineValidation,
    userVaccineValidation,
    getUserIdValidation,
    userVaccineIdValidation
}