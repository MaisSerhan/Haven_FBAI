const { addFile , getFile ,AllFiles ,deleteFile } = require("../Service/files_service");

const uploadFile = async (req, res) => {
    try {
        if (req.file) {
            const fileData = {
                file_name: req.file.originalname,
                file_path: req.file.path.replace(/\\/g, '/'),
                description:req.body.description || null,
            };
            const added = await addFile(fileData);
            return res.status(200).send({
                message: 'تم رفع الملف وتخزينه في قاعدة البيانات بنجاح.',
                file: fileData
            });
        } else if (req.body.file_url) {
            const fileData = {
                file_name: req.body.file_name,
                file_path: req.body.file_url,
                description: req.body.description || null,
            };
            const added = await addFile(fileData);
            return res.status(200).send({
                message: 'تم تخزين الرابط بنجاح.',
                file: fileData
            });
        } else {
            return res.status(400).send('لم يتم رفع أي ملف أو إرسال رابط.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('حدث خطأ في الخادم، يرجى المحاولة لاحقاً.');
    }
};

const getFileById = async (req, res) => {
    try {
        const { file_id } = req.params;
        const file = await getFile(file_id);
        if (file) {
            res.status(200).send(file);
        } else {
            res.status(404).send('الملف غير موجود.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('حدث خطاء في الخادم، يرجى المحاولة لاحقاً.');
    }
}

const getAllFiles = async (req, res) => {
    try {
        const files = await AllFiles();
        res.status(200).send(files);
    } catch (error) {
        console.error(error);
        res.status(500).send('حدث خطاء في الخادم، يرجى المحاولة لاحقاً.');
    }
}

const deleteFileById = async (req, res) => {
    try {
        const { file_id } = req.params;
        const deleted = await deleteFile(file_id);
        if (deleted) {
            res.status(200).send('تم حذف الملف بنجاح.');
        } else {
            res.status(404).send('الملف غير موجود.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('حدث خطاء في الخادم، يرجى المحاولة لاحقاً.');
    }
}

module.exports = {
    uploadFile , getFileById, getAllFiles,deleteFileById
};
