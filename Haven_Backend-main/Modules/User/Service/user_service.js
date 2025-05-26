const db = require('../../Constant/db_configuration');
const {USERS, FILES} = require('../../Constant/Db_tables');
const bcrypt = require('bcrypt');


const addUser = async (name, email, hashedPassword, city_id, level, role, profile_image) => {
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
}

const getFilteredUsers = async (filters) => {
    //join with the files table
    const query = db(USERS).select(
        `${USERS}.*`,
        `${FILES}.file_name`,
        `${FILES}.file_path`,
        `${FILES}.description`
    ).join(FILES, `${USERS}.user_id`, '=', `${FILES}.owner_id`);

    if (filters.user_id) {
        query.where('user_id', filters.user_id);
    }

    if (filters.name) {
        query.where('name', 'like', `%${filters.name}%`);
    }

    if (filters.level) {
        query.where('level', filters.level);
    }

    if (filters.role) {
        query.where('role', filters.role);
    }

    if (filters.city_id) {
        query.where('city_id', filters.city_id);
    }

    const results = await query;

    return results.map(({ password, ...user }) => user);
};



const UserDelete = async (user_id) => {
    try {
        return await db(USERS).where('user_id', user_id).delete();
    } catch (error) {
        return error;
    }
}

const updateUserInfo = async (user_id, name, email, city_id, level, role, profile_image) => {
    return await db.transaction(async trx => {
        const existingUser = await trx(USERS).where('user_id', user_id).first();
        if (!existingUser) throw new Error('المستخدم غير موجود');

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (city_id !== undefined) updateData.city_id = city_id;
        if (level !== undefined) updateData.level = level;
        if (role !== undefined) updateData.role = role;

        if (Object.keys(updateData).length > 0) {
            updateData.updated_at = new Date();
            await trx(USERS).where('user_id', user_id).update(updateData);
        }

        if (profile_image) {
            await trx(FILES)
                .where({ owner_type: 'user', owner_id: user_id })
                .update(
                    {
                        ...profile_image,
                        updated_at: new Date()
                    }
                );
        }

        return await trx(USERS).where('user_id', user_id).first();
    });
};

const changePasswordForUser = async (user_id, password , newPassword) => {
    try {
        const user = await db(USERS).where('user_id', user_id).first();
        if (!user) {
            throw new Error('المستخدم غير موجود');
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new Error('كلمة المرور غير صحيحة');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateResult = await db(USERS).where('user_id', user_id).update({ password: hashedPassword });
return updateResult;


    } catch (error) {
        throw error;
    }
}

const getEmail = async (email) => {
    try {
        return await db(USERS).where('email', email).first();
    } catch (error) {
        return error;
    }
}

const userPasswordReset = async (user_id, hashedPassword) => {
    try {
        return await db(USERS).where('user_id', user_id).update({ password: hashedPassword });
    } catch (error) {
        return error;
    }
}


module.exports = {
    addUser ,
    UserDelete,
    updateUserInfo,
    changePasswordForUser,
    getEmail,
    userPasswordReset,
    getFilteredUsers
}