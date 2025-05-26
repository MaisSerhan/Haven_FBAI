const bcrypt = require("bcrypt");
const { addDoctor ,updateDoctorService,deleteDoctorById,getDoctorsService } = require("../Service/doctors_service");


const addNewDoctor = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'يجب ارفاق صورة البطاقة للطبيب' });
    }

    const { name, email, password, city_id, phone, major, location } = req.body;

    const doctor_image = {
        file_name: req.file.originalname,
        file_path: req.file.path.replace(/\\/g, '/'),
        description: "doctor ID card"
    };

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newDoctor = await addDoctor(name, email, hashedPassword, city_id, phone, major, location, doctor_image);

        return res.status(201).json({
            message: 'تم إضافة الدكتور بنجاح',
            newDoctor
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateDoctorController = async (req, res) => {
    const doctor_id = req.user.role === 'doctor'
        ? req.user.user_id
        : req.params.doctor_id;

    if (!doctor_id) {
        return res.status(400).json({ message: "لم يتم تحديد هوية الدكتور" });
    }

    try {
        let updatedFields = { ...req.body };



        let doctor_image = null;
        if (req.file) {
            doctor_image = {
                file_name: req.file.originalname,
                file_path: req.file.path.replace(/\\/g, '/'),
                description: "doctor ID card"
            };
        }

        const updatedDoctor = await updateDoctorService(doctor_id, updatedFields, doctor_image);

        return res.status(200).json({
            message: "تم تعديل بيانات الدكتور بنجاح",
            updatedDoctor
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteDoctor = async (req, res) => {
    const { doctor_id } = req.params;

    try {
        const deletionResult = await deleteDoctorById(doctor_id);

        if (deletionResult) {
            return res.status(200).json({ message: "تم حذف الطبيب بنجاح" });
        } else {
            return res.status(404).json({ message: "الطبيب غير موجود" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getDoctorsController = async (req, res) => {
    try {
        const { name, city_id, major, location } = req.query;
        const results = await getDoctorsService({ name, city_id, major, location });

        return res.status(200).json({
            results
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


module.exports = {
    addNewDoctor, updateDoctorController, deleteDoctor, getDoctorsController
};