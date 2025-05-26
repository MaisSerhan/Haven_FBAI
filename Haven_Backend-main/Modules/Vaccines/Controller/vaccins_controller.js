const {
    addNewVaccineService, getAllVaccinesService, getVaccineByIdService, deleteVaccineService, updateVaccineService
    , addUserVaccineService, getUsersAndVaccinesService, getVaccinesByUserService, getUsersByVaccineService,deleteRecordService
} = require("../Service/vaccins_service");

const addNewVaccine = async (req, res) => {
    try {
        const {name, description} = req.body;
        const added = await addNewVaccineService(name, description);
        return res.status(200).json({message: 'تم اضافة الطعم بنجاح'});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const getAllVaccines = async (req, res) => {
    try {
        const vaccines = await getAllVaccinesService();
        return res.status(200).json(vaccines);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

const getVaccineById = async (req, res) => {
    try {
        const {vaccine_id} = req.params;
        const vaccine = await getVaccineByIdService(vaccine_id);

        return res.status(200).json(vaccine);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

const deleteVaccine = async (req, res) => {
    try {
        const {vaccine_id} = req.params;
        const result = await deleteVaccineService(vaccine_id);
        return res.status(200).json({message: 'تم حذف الطُعم بنجاح'});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

const updateVaccine = async (req, res) => {
    try {
        const {vaccine_id} = req.params;
        const {name, description} = req.body;

        const result = await updateVaccineService(vaccine_id, name, description);
        return res.status(200).json({message: 'تم تحديث الطُعم بنجاح'});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

const addUserVaccine = async (req, res) => {
    try {
        const {user_id, vaccine_id} = req.params;

        const result = await addUserVaccineService(user_id, vaccine_id);

        return res.status(201).json({message: "تم تسجيل الطُعم بنجاح"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

const getUsersAndVaccines = async (req, res) => {
    try {
        const data = await getUsersAndVaccinesService();

        if (!data.length) {
            return res.status(404).json({message: "لا يوجد مستخدمون مرتبطون بالطُعوم"});
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

const getVaccinesByUser = async (req, res) => {
    try {
        const {user_id} = req.params;
        const vaccines = await getVaccinesByUserService(user_id);

        if (!vaccines.length) {
            return res.status(404).json({message: "لا يوجد طُعوم مرتبطة بالمستخدم"});
        }

        return res.status(200).json(vaccines);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

const getUsersByVaccine = async (req, res) => {
    try {
        const {vaccine_id} = req.params;
        const users = await getUsersByVaccineService(vaccine_id);

        if (!users.length) {
            return res.status(404).json({message: "لا يوجد مستخدمون مرتبطون بهذا الطُعم"});
        }

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

const deleteRecord = async (req, res) => {
    try {
        const { user_vaccines_id } = req.params;
        const deleted = await deleteRecordService(user_vaccines_id);
         return res.status(200).json({ message: "تم حذف السجل المرتبط بالمستخدم والطُعم بنجاح" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};




module.exports = {
    addNewVaccine, getAllVaccines, getVaccineById, deleteVaccine, updateVaccine,
    addUserVaccine, getUsersAndVaccines, getVaccinesByUser, getUsersByVaccine, deleteRecord
}