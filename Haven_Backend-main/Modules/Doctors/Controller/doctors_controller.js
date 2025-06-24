const bcrypt = require("bcrypt"); 
const { addDoctor ,updateDoctorService,deleteDoctorById,getDoctorsService } = require("../Service/doctors_service"); 

const addNewDoctor = async (req, res) => { 
    if (!req.file) { 
        return res.status(400).json({ message: 'يجب ارفاق صورة البطاقة للطبيب' }); 
    } 

    const { name, email, password, city_id, phone, major, location } = req.body; 

    const parsed_city_id = parseInt(city_id, 10);
    if (isNaN(parsed_city_id)) {
        return res.status(400).json({ message: 'city_id غير صالح.' });
    }

    const doctor_image = { 
        file_name: req.file.originalname, 
        file_path: req.file.path.replace(/\\/g, '/'), 
        description: "doctor ID card" 
    }; 

    try { 
        const hashedPassword = await bcrypt.hash(password, 10); 
        const newDoctor = await addDoctor(name, email, hashedPassword, parsed_city_id, phone, major, location, doctor_image); 

        return res.status(201).json({ 
            message: 'تم إضافة الدكتور بنجاح', 
            newDoctor 
        }); 

    } catch (error) { 
        console.error("Error adding new doctor:", error); 
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

        if (updatedFields.city_id) {
            const parsed_city_id = parseInt(updatedFields.city_id, 10);
            if (isNaN(parsed_city_id)) {
                return res.status(400).json({ message: 'city_id غير صالح في التحديث.' });
            }
            updatedFields.city_id = parsed_city_id;
        }

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
const { getDoctorById } = require('../Service/doctors_service');

const getDoctorByIdController = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const doctor = await getDoctorById(doctor_id); // تأكد أن هذه الدالة ترجع النتيجة الصحيحة

    if (!doctor) {
      return res.status(404).json({ message: "الطبيب غير موجود" });
    }

    res.status(200).json({ data: doctor });
  } catch (err) {
    console.error(err); // مهم جداً لفهم الخطأ
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
};


module.exports = { 
    addNewDoctor, updateDoctorController, deleteDoctor,getDoctorByIdController, getDoctorsController 
};
