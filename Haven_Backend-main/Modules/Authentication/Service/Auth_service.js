// Authentication/Service/Auth_service.js
const db = require("../../Constant/db_configuration"); // تأكد أن هذا المسار صحيح لإعداد Knex الخاص بك
const { USERS, DOCTORS, FILES } = require("../../Constant/Db_tables");
const bcrypt = require("bcrypt"); // تأكد أنك تستورد bcrypt

// Helper function to build full image URL
const getFullImagePath = (filePath) => {
    // If filePath is relative (e.g., '/uploads/images/some.jpg'), make it absolute
    // Ensure this matches your static file serving setup in your backend
    if (filePath && !filePath.startsWith('http')) {
        // Assuming your backend serves static files from http://localhost:3001
        return `http://localhost:3001/${filePath}`; 
    }
    return filePath; // Already an absolute URL or null
};

const login = async (email, password) => {
    // Try to find doctor first, with their profile image
    const doctor = await db(DOCTORS)
        .leftJoin(FILES, function() { // LEFT JOIN to get image if it exists
            this.on(`${DOCTORS}.doctor_id`, '=', `${FILES}.owner_id`)
                .andOn(`${FILES}.owner_type`, '=', db.raw('?', ['doctor']));
        })
        .where(`${DOCTORS}.email`, email)
        .first();

    if (doctor) {
        if (await bcrypt.compare(password, doctor.password)) {
            const { password: _, ...safeDoctor } = doctor;
            // Add profile_image_path
            safeDoctor.profile_image_path = getFullImagePath(doctor.file_path);
            if (!safeDoctor.profile_image_path) { // Set default if no image found
                 safeDoctor.profile_image_path = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
            }
            return { ...safeDoctor, role: 'doctor' };
        }
    }

    // If not a doctor, try to find user, with their profile image
    const user = await db(USERS)
        .leftJoin(FILES, function() { // LEFT JOIN to get image if it exists
            this.on(`${USERS}.user_id`, '=', `${FILES}.owner_id`)
                .andOn(`${FILES}.owner_type`, '=', db.raw('?', ['user']));
        })
        .where(`${USERS}.email`, email)
        .first();

    if (user) {
        if (await bcrypt.compare(password, user.password)) {
            const { password: _, ...safeUser } = user;
            // Add profile_image_path
            safeUser.profile_image_path = getFullImagePath(user.file_path);
            if (!safeUser.profile_image_path) { // Set default if no image found
                 safeUser.profile_image_path = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
            }
            return { ...safeUser, role: user.role };
        }
    }

    throw new Error('كلمة المرور او البريد الالكتروني غير صحيح');
};

const register = async (name, email, hashedPassword, city_id, level, role, profile_image, last_period_date, pregnancy_month) => {
    return await db.transaction(async trx => {
        const existingUser = await trx(USERS).where('email', email).first();
        if (existingUser) {
            throw new Error('البريد الإلكتروني موجود بالفعل');
        }

        const [user_id] = await trx(USERS).insert({
            name,
            email,
            password: hashedPassword,
            city_id,
            level,
            role,
            last_period_date: last_period_date || null, // إضافة تاريخ آخر دورة شهرية
            pregnancy_month: pregnancy_month || null, // إضافة شهر الحمل
        }).returning('user_id'); // Ensure 'user_id' is returned from insertion

        let profile_image_path_to_return = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; // Default path

        if (profile_image) {
            await trx(FILES).insert({
                file_name: profile_image.file_name,
                file_path: profile_image.file_path,
                is_external: false,
                description: profile_image.description,
                owner_type: "user",
                owner_id: user_id, // Link to the newly created user_id
            });
            profile_image_path_to_return = getFullImagePath(profile_image.file_path);
        }
        
        // Return the new user data including the profile image path and pregnancy data
        return { 
            user_id: user_id, 
            name: name, 
            email: email, 
            role: role, 
            level: level,
            profile_image_path: profile_image_path_to_return, // Return the path
            last_period_date: last_period_date || null, // إعادة تاريخ آخر دورة شهرية
            pregnancy_month: pregnancy_month || null, // إعادة شهر الحمل
        };
    });
};

const registerDoctorService = async (name, email, hashedPassword, city_id, phone, major, location, doctor_image) => {
    return await db.transaction(async trx => {
        const existingDoctor = await trx(DOCTORS).where('email', email).first();
        if (existingDoctor) {
            throw new Error('البريد الإلكتروني موجود بالفعل');
        }

        const [doctor_id] = await trx(DOCTORS).insert({
            name,
            email,
            password: hashedPassword,
            city_id,
            phone,
            major,
            location
        }).returning('doctor_id'); // Ensure 'doctor_id' is returned

        let doctor_image_path_to_return = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; // Default path for doctor

        if (doctor_image) {
            await trx(FILES).insert({
                file_name: doctor_image.file_name,
                file_path: doctor_image.file_path,
                is_external: false,
                description: doctor_image.description,
                owner_type: "doctor",
                owner_id: doctor_id
            });
            doctor_image_path_to_return = getFullImagePath(doctor_image.file_path);
        }
        
        // Return the new doctor data including the profile image path
        return {
            doctor_id: doctor_id,
            name: name,
            email: email,
            role: 'doctor', // Explicitly set role for consistency
            profile_image_path: doctor_image_path_to_return // Return the path
        };
    });
};

module.exports = { login, register, registerDoctorService };
