const express = require('express');
const router = express.Router();
const {uploadFile , getFileById, getAllFiles,deleteFileById} = require("../Controller/files_controller")
// const multer = require('multer');
// const fs = require("fs");
// const uploadFolder = 'uploads/';
// if (!fs.existsSync(uploadFolder)) {
//     fs.mkdirSync(uploadFolder);
// }
//
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, uploadFolder);
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });
//
// const fileFilter = (req, file, cb) => {
//     cb(null, true);
// };
//
// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
// });
const upload = require("../../UploadFiles");

const {param} = require("express-validator");
const validate = require("../../Validation_result/validation_result");
const id = param('file_id').isInt().withMessage('معرف الملف يجب ان يكون رقم صحيح');


router.post('/upload', upload.single('file') , uploadFile)
router.get('/:file_id', id ,validate , getFileById)
router.get('/', getAllFiles)
router.delete('/:file_id' , id ,validate , deleteFileById)



module.exports = router;