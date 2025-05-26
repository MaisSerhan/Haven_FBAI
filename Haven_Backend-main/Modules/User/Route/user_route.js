const express = require('express');
const router = express.Router();
const {userValidation ,getUserID ,updateUserInformation
    ,changePassword ,userGetEmailValidation ,resetPasswordValidation } = require("../Validation/user_validation")
const validate = require("../../Validation_result/validation_result")
const {addNewUser ,getUsersHandler,deleteUser ,updateUser ,changeUserPassword , userGetEmail, resetPassword} = require("../Controller/user_controller")
const upload = require("../../UploadFiles");
const Authenticated = require("../../Authentication/auhentication_middlware")

router.post('/addUser',Authenticated  , upload.single('file') , userValidation , validate , addNewUser);

router.get('/get', getUsersHandler);

router.delete('/deleteUser/:user_id', getUserID, validate, deleteUser)

router.put('/:user_id',upload.single('file') ,updateUserInformation, validate, updateUser)

router.patch('/changePassword/:user_id', changePassword, validate, changeUserPassword)

router.post('/userEmail', userGetEmailValidation, validate ,userGetEmail);

router.patch('/resetPassword', resetPasswordValidation,validate, resetPassword);


module.exports = router;