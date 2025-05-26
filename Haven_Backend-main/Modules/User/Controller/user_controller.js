const bcrypt = require("bcrypt");
const {addUser , AllUsers , getUser , UserDelete ,updateUserInfo
    ,changePasswordForUser , getEmail , userPasswordReset, getFilteredUsers} = require("../Service/user_service");
const jwt = require('jsonwebtoken');
const {sendResetEmail} = require("../../Emails/ResetEmail");

const addNewUser = async (req, res) => {
    const { name, email, password, city_id, level, role } = req.body;

    try {
        const profile_image = req.file
            ? {
                file_name: req.file.originalname,
                file_path: req.file.path.replace(/\\/g, '/'),
                description: req.body.description || null,
            }
            : null;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await addUser(name, email, hashedPassword, city_id, level, role , profile_image);
        return res.status(200).json({
            message: 'تم اضافة المستخدم بنجاح',
            user
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const getUsersHandler = async (req, res) => {
    try {
        const filters = {
            user_id: req.query.user_id,
            name: req.query.name,
            level: req.query.level,
            role: req.query.role,
            city_id: req.query.city_id
        };

        const users = await getFilteredUsers(filters);
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



const deleteUser = async (req, res) => {
    const {user_id} = req.params;
    try {
        const user = await UserDelete(user_id);
        return res.status(200).json({
            message: 'تم حذف المستخدم بنجاح',
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const updateUser = async (req, res) => {
    const { user_id } = req.params;
    const { name, email, city_id, level, role, description } = req.body;

    const profile_image = req.file
        ? {
            file_name: req.file.originalname,
            file_path: req.file.path.replace(/\\/g, '/'),
            description: description || null,
        }
        : null;

    try {
        const updatedUser = await updateUserInfo(user_id, name, email, city_id, level, role, profile_image);
        return res.status(200).json({
            message: 'تم تحديث معلومات المستخدم بنجاح',
            user: updatedUser
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const changeUserPassword = async (req, res) => {
    const {user_id} = req.params;
    const {password, newPassword} = req.body;
    try {
        const user = await changePasswordForUser(user_id, password, newPassword);
        return res.status(200).json({
            result: user
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const userGetEmail = async (req, res) => {
    const {email} = req.body;
    const domain = req.headers['domain'];

    try {
        const user = await getEmail(email);
        if (!user) {
            return res.status(404).json({error: 'المستخدم غير موجود'});
        }

        const accessToken = jwt.sign({email: user.email, id: user.id}, process.env.JWT_SECRET, {expiresIn: '10m'});
        await sendResetEmail(email, accessToken, domain);
        res.status(200).json({message: 'تم ارسال البريد الالكتروني بنجاح'});

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'حدث خطأ ما'});
    }
};

const resetPassword = async (req, res) => {
    const {token, newPassword} = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const {email} = decoded;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await getEmail(email);
        if (!user) {
            return res.status(400).json({message: 'رمز التحقق غير صالح أو المستخدم غير موجود'});
        }

        const result = await userPasswordReset(user.user_id, hashedPassword);

        if (!result) {
            return res.status(400).json({message: 'فشل في إعادة تعيين كلمة المرور'});
        }

        res.status(200).json({message: 'تم إعادة تعيين كلمة المرور بنجاح'});

    } catch (err) {
        console.error(err);
        res.status(400).json({message: 'انتهت صلاحية الرابط أو الرابط غير صالح'});
    }
}


module.exports = {
    addNewUser ,
    deleteUser,
    updateUser,
    changeUserPassword,
    userGetEmail,
    resetPassword,
    getUsersHandler
}