const {addWheel ,getWheelService , updateWheelService} = require('../Service/wheels_service');



const addNewWheel = async (req, res) => {
    try {
        const {description , type} = req.body;
        const added = await addWheel(description , type);
        return res.status(200).json({message: 'تم اضافة المعلومات بنجاح'});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const getWheel = async (req, res) => {
    try {
        const {type} = req.body;
        const wheel = await getWheelService(type);
        return res.status(200).json({wheel});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const updateWheel = async (req, res) => {
    try {
        const {wheel_id} = req.params;
        const {description , type} = req.body;
        const wheel = await updateWheelService(wheel_id , description , type);
        return res.status(200).json({wheel});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}



module.exports = {addNewWheel , getWheel , updateWheel }