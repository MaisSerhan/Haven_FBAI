const {body , param} = require('express-validator');
const db = require("../../Constant/db_configuration");
const {CITIES} = require("../../Constant/Db_tables");

const name = body('name').notEmpty().withMessage('الاسم مطلوب').isString();
const id = param('city_id').isInt().withMessage('معرف المدينة يجب ان يكون رقم صحيح').custom(async (value) => {
    const city = await db(CITIES).where('city_id', value).first();
    if (!city) {
        throw new Error('المدينة غير موجودة');
    }
    return true;
});


const createCity = [name]
const getCityById = [id]
module.exports = {
    createCity,
    getCityById

}