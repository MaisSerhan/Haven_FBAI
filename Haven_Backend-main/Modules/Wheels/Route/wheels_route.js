const express = require('express');
const router = express.Router();

const {addNewWheel , getWheel, updateWheel} = require("../Controller/wheels_controller")
const {validateCreateWheel, validateGetWheelByType ,validateUpdateWheel} = require("../Validation/wheels_validation")
const validate = require("../../Validation_result/validation_result");


router.post('/add' ,validateCreateWheel , validate , addNewWheel)
router.get('/getWheel' , validateGetWheelByType , validate , getWheel)
router.put('/updateWheel/:wheel_id' , validateUpdateWheel , validate , updateWheel)

module.exports = router;