const express = require('express');
const router = express.Router();

const {loginValidation , UserRegisterValidation,DoctorRegisterValidation} = require("../../Authentication/Validation/Auth_validation");
const validate = require("../../Validation_result/validation_result");
const {loginUser , registerUser,registerDoctor} = require("../../Authentication/Controller/Auth_controller");
const upload = require("../../UploadFiles");

router.post('/login' , loginValidation , validate , loginUser)
router.post('/userRegister' , upload.single('file'), UserRegisterValidation , validate , registerUser)
router.post('/doctorRegister' , upload.single('file'), DoctorRegisterValidation , validate , registerDoctor)
module.exports = router;
