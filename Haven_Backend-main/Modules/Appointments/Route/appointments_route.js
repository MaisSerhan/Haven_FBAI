const express = require('express');
const router = express.Router();
const Authenticated = require('../../Authentication/auhentication_middlware');
const validate = require('../../Validation_result/validation_result');
const {
    appointmentValidation, getAppointmentId, updateAppointmentValidation
    , validateQuery
} = require("../Validation/appointments_validation")
const {addAppointment, deleteAppointment, updateAppointment,getUserAppointments,getAppointments} = require("../Controller/appointments_controller")

router.post('/add', Authenticated, appointmentValidation, validate, addAppointment)
router.delete('/delete/:appointment_id', Authenticated, getAppointmentId, validate, deleteAppointment)
router.put('/update/:appointment_id', Authenticated, updateAppointmentValidation, validate, updateAppointment)
router.get('/appointments', Authenticated, validateQuery, getAppointments);

module.exports = router;