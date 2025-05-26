const { saveWeeklySchedule , deleteScheduleService, getSchedulesService } = require("../Service/schedule_service");

const addNewSchedule = async (req, res) => {
    try {
        const { week_start_date, schedule } = req.body;
        const {doctor_id} = req.user

        await saveWeeklySchedule({ doctor_id,week_start_date, schedule });

        return res.status(200).json({ message: "تم حفظ الجدول بنجاح." });
    } catch (error) {
        console.error("Error saving schedule:", error);
        if (error.message === "تم تحديد جدول لهذا الأسبوع من قبل.") {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "حدث خطأ أثناء حفظ الجدول." });
    }
}

const deleteSchedule = async (req, res) => {
    const {doctor_id} = req.params;
    try {
        await deleteScheduleService(doctor_id);
        return res.status(200).json({ message: "تم حذف مواعيد الطبيب بنجاح." });
    } catch (error) {
        console.error("Error deleting schedule:", error);
        return res.status(500).json({ message: "حدث خطاء اثناء حذف مواعيد الطبيب." });
    }
}

const getSchedules = async (req, res) => {
    try {
        const filters = {
            doctor_id: req.query.doctor_id,
            week_start_date: req.query.week_start_date,
            is_available: req.query.is_available,
            start_date: req.query.start_date,
            end_date: req.query.end_date,
            doctor_name: req.query.doctor_name
        };

        const schedules = await getSchedulesService(filters);

        return res.status(200).json(schedules);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        return res.status(500).json({ message: 'حدث خطأ أثناء جلب الجداول.' });
    }
};


module.exports = {
    addNewSchedule,
    deleteSchedule,
    getSchedules
}