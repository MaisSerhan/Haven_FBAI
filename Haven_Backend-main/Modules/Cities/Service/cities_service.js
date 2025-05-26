const db = require('../../Constant/db_configuration');
const {CITIES} = require('../../Constant/Db_tables');


const createCity = async (name) => {
    try {
        return await db(CITIES).insert({city_name :name});
    } catch (error) {
        return error;
    }
}

const AllCities = async () => {
    try {
        return await db(CITIES).select('*');
    } catch (error) {
        return error;
    }
}

const getCityService = async (city_id) => {
    try {
        return await db(CITIES).where('city_id', city_id).first();
    } catch (error) {
        return error;
    }
}

const deleteCityService = async (city_id) => {
    try {
        return await db(CITIES).where('city_id', city_id).delete();
    } catch (error) {
        return error;
    }
}

const updateCityService = async (city_id , name) => {
    try {
        return await db(CITIES).where('city_id', city_id).update({city_name :name});
    } catch (error) {
        return error;
    }
}


module.exports = {
    createCity , AllCities , getCityService , deleteCityService , updateCityService
}