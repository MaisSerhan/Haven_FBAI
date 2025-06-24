const express = require('express');
const router = express.Router();
const upload = require("../../UploadFiles");
const {addDoctor,updateDoctorValidation,getDoctorById} = require("../Validation/doctors_validation");
const {addNewDoctor, updateDoctorController ,deleteDoctor,getDoctorsController} = require("../Controller/doctors_controller");
const validate = require("../../Validation_result/validation_result");
const Authenticated = require('../../Authentication/auhentication_middlware');
const { getDoctorByIdController } = require('../Controller/doctors_controller');


router.post('/add' , Authenticated , upload.single('file'),addDoctor , validate , addNewDoctor);
router.put('/update/:doctor_id?',Authenticated, upload.single('file'),updateDoctorValidation,validate,updateDoctorController);
router.delete('/delete/:doctor_id',Authenticated,getDoctorById,validate,deleteDoctor);
router.get('/get',Authenticated, getDoctorsController);
router.get('/:doctor_id', Authenticated, getDoctorById, validate, getDoctorByIdController);


module.exports = router;
