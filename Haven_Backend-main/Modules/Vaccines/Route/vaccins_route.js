const express = require('express');
const router = express.Router();
const {createVaccineValidation , getIdValidation ,updateVaccineValidation
    ,userVaccineValidation ,getUserIdValidation ,userVaccineIdValidation} = require("../Validation/vaccins_validation")
const validate = require("../../Validation_result/validation_result");
const {addNewVaccine ,getAllVaccines , getVaccineById , deleteVaccine ,updateVaccine
    ,addUserVaccine , getUsersAndVaccines ,getVaccinesByUser,getUsersByVaccine ,deleteRecord} = require("../Controller/vaccins_controller")


router.post('/addVaccine' , createVaccineValidation , validate , addNewVaccine )

router.get('/getAllVaccines', getAllVaccines);

router.get('/getVaccine/:vaccine_id',getIdValidation, validate , getVaccineById )

router.delete('/deleteVaccine/:vaccine_id',getIdValidation, validate, deleteVaccine);

router.put('/updateVaccine/:vaccine_id',updateVaccineValidation,validate,updateVaccine);

router.post("/addUserVaccine/:user_id/:vaccine_id", userVaccineValidation, validate, addUserVaccine);

router.get("/getUsersAndVaccines", getUsersAndVaccines);

router.get("/getVaccinesByUser/:user_id", getUserIdValidation, validate, getVaccinesByUser);

router.get("/getUsersByVaccine/:vaccine_id", getIdValidation, validate, getUsersByVaccine);

router.delete("/deleteUserVaccine/:user_vaccines_id", userVaccineIdValidation, validate, deleteRecord);


module.exports = router;