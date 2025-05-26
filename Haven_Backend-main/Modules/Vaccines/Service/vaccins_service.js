const {VACCINES, USER_VACCINES, USERS} = require("../../Constant/Db_tables");
const db = require("../../Constant/db_configuration");


const addNewVaccineService = async (name, description) => {
    try {
        return await db(VACCINES).insert({name, description});
    } catch (error) {
        return error;
    }
}

const getAllVaccinesService = async () => {
    try {
        return await db(VACCINES).select('*');
    } catch (error) {
        throw error;
    }
};

const getVaccineByIdService = async (vaccine_id) => {
    try {
        return await db(VACCINES).where('vaccine_id', vaccine_id).first();
    } catch (error) {
        throw error;
    }
};

const deleteVaccineService = async (vaccine_id) => {
    try {
        return await db(VACCINES).where('vaccine_id', vaccine_id).delete();
    } catch (error) {
        throw error;
    }
};

const updateVaccineService = async (vaccine_id, name, description) => {
    try {
        return await db(VACCINES)
            .where('vaccine_id', vaccine_id)
            .update({name, description});
    } catch (error) {
        throw error;
    }
};

const addUserVaccineService = async (user_id, vaccine_id) => {
    try {
        return await db(USER_VACCINES).insert({user_id, vaccine_id});
    } catch (error) {
        throw error;
    }
};

const getUsersAndVaccinesService = async () => {
    try {
        return await db(USER_VACCINES)
            .join(USERS, `${USERS}.user_id`, '=', `${USER_VACCINES}.user_id`)
            .join(VACCINES, `${VACCINES}.vaccine_id`, '=', `${USER_VACCINES}.vaccine_id`)
            .select(
                `${USERS}.user_id`,
                `${USERS}.name as user_name`,
                `${VACCINES}.vaccine_id`,
                `${VACCINES}.name as vaccine_name`,
                `${VACCINES}.description`
            );
    } catch (error) {
        throw error;
    }
};

const getVaccinesByUserService = async (user_id) => {
    try {
        return await db(USER_VACCINES)
            .join(VACCINES, `${VACCINES}.vaccine_id`, '=', `${USER_VACCINES}.vaccine_id`)
            .where(`${USER_VACCINES}.user_id`, user_id)
            .select(
                `${VACCINES}.vaccine_id`,
                `${VACCINES}.name as vaccine_name`,
                `${VACCINES}.description`
            );
    } catch (error) {
        throw error;
    }
};

const getUsersByVaccineService = async (vaccine_id) => {
    try {
        return await db(USER_VACCINES)
            .join(USERS, `${USERS}.user_id`, '=', `${USER_VACCINES}.user_id`)
            .where(`${USER_VACCINES}.vaccine_id`, vaccine_id)
            .select(
                `${USERS}.user_id`,
                `${USERS}.name as user_name`,
                `${USERS}.email`,
                `${USERS}.phone`
            );
    } catch (error) {
        throw error;
    }
};

const deleteRecordService = async (user_vaccines_id) => {
    try {
        return await db(USER_VACCINES)
            .where("user_vaccines_id", user_vaccines_id)
            .delete();
    } catch (error) {
        throw error;
    }
};


module.exports = {
    addNewVaccineService, getAllVaccinesService, getVaccineByIdService, deleteVaccineService, updateVaccineService
    , addUserVaccineService, getUsersAndVaccinesService, getVaccinesByUserService, getUsersByVaccineService,
    deleteRecordService
}