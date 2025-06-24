const { login, register, registerDoctorService } = require("../../Authentication/Service/Auth_service");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await login(email, password);

        const user_id = user.role === 'doctor' ? user.doctor_id : user.user_id;

        const token = jwt.sign(
            { user_id, email: user.email, role: user.role },
            process.env.JWT_SECRET
        );

        return res.status(200).json({
            result: {
                user_id,
                email: user.email,
                role: user.role,
                level: user.level,
                name: user.name,
                profile_image_path: user.profile_image_path,
                // إضافة بيانات الحمل هنا
                pregnancy_month: user.pregnancy_month, 
                last_period_date: user.last_period_date, 
            },
            token,
        });
    } catch (error) {
        const statusCode = error.message === 'كلمة المرور او البريد الالكتروني غير صحيح' ? 401 : 500;
        return res.status(statusCode).json({ message: error.message });
    }
};

const registerUser = async (req, res) => {
    // إضافة last_period_date و pregnancy_month إلى destructuring
    const { name, email, password, city_id, level, role, last_period_date, pregnancy_month } = req.body;

    const profile_image = req.file
        ? {
            file_name: req.file.originalname,
            file_path: req.file.path.replace(/\\/g, '/'),
            description: req.body.description || null,
        }
        : null;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // تمرير last_period_date و pregnancy_month إلى دالة الخدمة 'register'
        const newUser = await register(
            name, 
            email, 
            hashedPassword, 
            city_id, 
            level, 
            role, 
            profile_image,
            last_period_date, // إضافة تاريخ آخر دورة شهرية
            pregnancy_month // إضافة شهر الحمل
        );

        const token = jwt.sign(
            { user_id: newUser.user_id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET
        );

        return res.status(201).json({
            result: {
                user_id: newUser.user_id,
                email: newUser.email,
                role: newUser.role,
                name: newUser.name,
                level: newUser.level, // تأكد من أن مستوى المستخدم يتم إرجاعه أيضًا
                profile_image_path: newUser.profile_image_path, // تأكد من مسار الصورة
                // إضافة بيانات الحمل إلى الاستجابة
                pregnancy_month: newUser.pregnancy_month, 
                last_period_date: newUser.last_period_date, 
            },
            token
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const registerDoctor = async (req, res) => {
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

        const newDoctor = await registerDoctorService(name, email, hashedPassword, city_id, phone, major, location, doctor_image);

        const token = jwt.sign(
            { user_id: newDoctor.doctor_id, email: newDoctor.email, role: 'doctor' },
            process.env.JWT_SECRET
        );

        return res.status(201).json({
            result: {
                user_id: newDoctor.doctor_id,
                email: newDoctor.email,
                role: 'doctor',
            },
            token
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { loginUser, registerUser, registerDoctor };
