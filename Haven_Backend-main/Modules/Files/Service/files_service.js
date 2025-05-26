const db = require("../../Constant/db_configuration");
const { FILE } = require("../../Constant/Db_tables");

const addFile = async (fileData) => {
    try {

        const [newFile] = await db(FILE).insert(fileData).returning('*');

        return newFile;
    } catch (error) {
        console.error("خطأ أثناء إضافة الملف إلى قاعدة البيانات:", error);
        throw new Error('فشل في إضافة الملف إلى قاعدة البيانات');
    }
};

const getFile = async (file_id) => {
    try {
        const file = await db(FILE).where('file_id', file_id).first();
        return file;
    } catch (error) {
        console.error("خطاء في جلب الملف من قاعدة البيانات:", error);
        throw new Error('فشل في جلب الملف من قاعدة البيانات');
    }
}

const AllFiles = async () => {
    try {
        const files = await db(FILE).select('*');
        return files;
    } catch (error) {
        throw new Error('فشل في جلب جميع الملفات من قاعدة البيانات');
    }
}

const deleteFile = async (file_id) => {
    try {
        const deletedFile = await db(FILE).where('file_id', file_id).delete();
        return deletedFile;
    } catch (error) {
        console.error("خطاء في حذف الملف من قاعدة البيانات:", error);
        throw new Error('فشل في حذف الملف من قاعدة البيانات');
    }
}

module.exports = {
    addFile , getFile , AllFiles,deleteFile
};
