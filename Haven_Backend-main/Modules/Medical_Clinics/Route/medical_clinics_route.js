const express = require('express');
const router = express.Router();
const {validateCreateMedicalClinic , validateGetMedicalClinicById, validateUpdateMedicalClinic
    ,validateGetMedicalClinicByCity , validateGetMedicalClinicByName} = require("../Validation/medical_clinics_validation")
const validate = require('../../Validation_result/validation_result')
const {addNewMedicalClinic , getAllMedicalClinics ,getMedicalClinicById , deleteMedicalClinic , updateMedicalClinic
    ,getAllMedicalClinicsByCity , getAllMedicalClinicsByName} = require("../Controller/medical_clinics_controller")

router.post('/add' ,validateCreateMedicalClinic , validate , addNewMedicalClinic);
router.get('/getAll' , getAllMedicalClinics)
router.get('/:medical_clinic_id' , validateGetMedicalClinicById , validate ,getMedicalClinicById)
router.delete('/:medical_clinic_id' , validateGetMedicalClinicById , validate ,deleteMedicalClinic)
router.put('/:medical_clinic_id' , validateUpdateMedicalClinic , validate ,updateMedicalClinic)
router.get('/search/city' , validateGetMedicalClinicByCity , validate ,getAllMedicalClinicsByCity)
router.get('/search/name' ,validateGetMedicalClinicByName , validate ,getAllMedicalClinicsByName)

module.exports = router;