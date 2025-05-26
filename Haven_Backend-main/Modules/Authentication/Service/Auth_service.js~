const db = require("../../Constant/db_configuration");
const { USERS, DOCTORS,FILES } = require("../../Constant/Db_tables");
const bcrypt = require("bcrypt");

const login = async (email, password) => {
    const doctor = await db(DOCTORS).where('email', email).first();
    if (doctor && await bcrypt.compare(password, doctor.password)) {
        const { password: _, ...safeDoctor } = doctor;
        return { ...safeDoctor, role: 'doctor' };
    }

    const user = await db(USERS).where('email', email).first();
    if (user && await bcrypt.compare(password, user.password)) {
        const { password: _, ...safeUser } = user;
        return { ...safeUser, role: user.role };
    }

    throw new Error('كلمة المرور او البريد الالكتروني غير صحيح');
};

const register = async (name, email, hashedPassword, city_id, level, role, profile_image) => {
    return await db.transaction(async trx => {
        const existingUser = await trx(USERS).where('email', email).first();
        if (existingUser) {
            throw new Error('البريد الإلكتروني موجود بالفعل');
        }

        await trx(USERS).insert({
            name,
            email,
            password: hashedPassword,
            city_id,
            level,
            role,
        });

        const newUser = await trx(USERS).where('email', email).first();

        const fileData = profile_image
            ? {
                file_name: profile_image.file_name,
                file_path: profile_image.file_path,
                description: profile_image.description,
            }
            : {
                file_name: "default profile image.jpeg",
                file_path: "/images/default profile image.jpeg",
                description: "default profile picture",
            };

        await trx(FILES).insert({
            ...fileData,
            owner_type: "user",
            owner_id: newUser.user_id,
        });

        const { password: _, ...safeUser } = newUser;
        return safeUser;
    });
};

const registerDoctorService = async (name, email, hashedPassword, city_id, phone, major, location, doctor_image) => {
    return await db.transaction(async trx => {
        const existingDoctor = await trx(DOCTORS).where('email', email).first();
        if (existingDoctor) {
            throw new Error('البريد الإلكتروني موجود بالفعل');
        }

        await trx(DOCTORS).insert({
            name,
            email,
            password: hashedPassword,
            city_id,
            phone,
            major,
            location
        });

        const newDoctor = await trx(DOCTORS).where('email', email).first();

        await trx(FILES).insert({
            file_name: doctor_image.file_name,
            file_path: doctor_image.file_path,
            description: doctor_image.description,
            owner_type: "doctor",
            owner_id: newDoctor.doctor_id
        });

        const { password: _, ...safeDoctor } = newDoctor;
        return safeDoctor;
    });
};

module.exports = { login, register, registerDoctorService };
