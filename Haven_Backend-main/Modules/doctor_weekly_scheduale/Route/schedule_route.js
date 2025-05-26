const express = require('express');
const router = express.Router();
const {validateDoctorWeeklySchedule, getDoctorId} = require("../Validation/schedule_validation")
const {addNewSchedule,deleteSchedule, getSchedules} = require("../Controller/schedule_controller")
const validate = require("../../Validation_result/validation_result");
const Authenticated = require('../../Authentication/auhentication_middlware');

router.post('/add', Authenticated, validateDoctorWeeklySchedule ,validate, addNewSchedule);
router.delete('/delete/:doctor_id', Authenticated,getDoctorId ,validate, deleteSchedule);
router.get('/get', Authenticated, getSchedules);
module.exports = router;