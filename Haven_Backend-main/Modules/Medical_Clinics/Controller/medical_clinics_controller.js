
const {NewMedicalClinic , AllMedicalClinics , getMedical , deleteMedical , updateMedical
    ,AllMedicalClinicsByCity,AllMedicalClinicsByName} = require("../Service/medical_clinics_service");

const addNewMedicalClinic = async (req, res) => {
const {name , address , phone , specialization , city_id} = req.body;
try {
    const added = await NewMedicalClinic(name , address , phone , specialization , city_id);
    return res.status(200).json({message: 'تم اضافة العيادة بنجاح'});
} catch (error) {
    return res.status(500).json({message: error.message});
}
}

const getAllMedicalClinics = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { clinics, total } = await AllMedicalClinics(limit, offset);

        return res.status(200).json({
            total: total,
            limit: limit,
            page: page,
            clinics: clinics
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const getMedicalClinicById = async (req, res) => {
    const {medical_clinic_id} = req.params;
    try {
        const clinic = await getMedical(medical_clinic_id);
        return res.status(200).json({
            clinic: clinic
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const deleteMedicalClinic = async (req, res) => {
    const {medical_clinic_id} = req.params;
    try {
        const clinic = await deleteMedical(medical_clinic_id);
        return res.status(200).json({
            clinic: clinic
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const updateMedicalClinic = async (req, res) => {
    const {medical_clinic_id} = req.params;
    const {name , address , phone , specialization , city_id} = req.body;
    try {
        const clinic = await updateMedical(medical_clinic_id , name , address , phone , specialization , city_id);
        return res.status(200).json({
            clinic: clinic
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const getAllMedicalClinicsByCity = async (req, res) => {
    const { city_id } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const { clinics, total } = await AllMedicalClinicsByCity(city_id, limit, offset);
        return res.status(200).json({
            total,
            page,
            limit,
            clinics
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const getAllMedicalClinicsByName = async (req, res) => {
    const { name } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const { clinics, total } = await AllMedicalClinicsByName(name, limit, offset);
        return res.status(200).json({
            total,
            page,
            limit,
            clinics
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    addNewMedicalClinic ,
    getAllMedicalClinics,
    getMedicalClinicById,
    deleteMedicalClinic,
    updateMedicalClinic,
    getAllMedicalClinicsByCity,
    getAllMedicalClinicsByName
}