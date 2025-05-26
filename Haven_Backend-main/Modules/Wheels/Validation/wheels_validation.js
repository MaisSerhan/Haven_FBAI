const {body, param} = require('express-validator');

const description = body('description').notEmpty().withMessage('الوصف مطلوب').isString();
const type = body('type').notEmpty().withMessage('النوع مطلوب').isString();

const id = param('wheel_id').isInt().withMessage('معرف العجلة يجب ان يكون رقم صحيح');

const validateCreateWheel = [description , type]
const validateGetWheelByType = [type]
const validateUpdateWheel = [id , description , type]
module.exports = {
    validateCreateWheel , validateGetWheelByType , validateUpdateWheel
}