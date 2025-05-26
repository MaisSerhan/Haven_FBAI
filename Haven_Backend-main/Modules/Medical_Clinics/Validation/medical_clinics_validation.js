const {body , param} = require('express-validator');
const db = require("../../Constant/db_configuration");
const {CITIES} = require("../../Constant/Db_tables");


const name = body('name').notEmpty().withMessage('الاسم مطلوب').isString();
const address = body('address').notEmpty().withMessage('العنوان مطلوب').isString();
const phone = body('phone').notEmpty().withMessage('رقم الهاتف مطلوب').isString();
const specialization = body('specialization').notEmpty().withMessage('التخصص مطلوب').isString();
const city_id = body('city_id').notEmpty().withMessage('معرف المدينة مطلوب').isInt().withMessage('معرف المدينة يجب ان يكون رقم صحيح')
    .custom((value)=>{
        return db(CITIES).where('city_id' , value).first().then((city)=>{
            if (!city) {
                return Promise.reject('معرف المدينة غير صحيح');
            }
            return Promise.resolve();
        })
    })


const id = param('medical_clinic_id').isInt().withMessage('معرف العيادة يجب ان يكون رقم صحيح')

const validateCreateMedicalClinic = [name , address , phone , specialization , city_id]
const validateGetMedicalClinicById = [id]
const validateUpdateMedicalClinic = [id ,name , address , phone , specialization, city_id]
const validateGetMedicalClinicByCity = [city_id]
const validateGetMedicalClinicByName = [name]
module.exports = {
    validateCreateMedicalClinic , validateGetMedicalClinicById ,validateUpdateMedicalClinic , validateGetMedicalClinicByCity,
    validateGetMedicalClinicByName
}