const {createCity,AllCities , getCityService ,deleteCityService, updateCityService} = require("../Service/cities_service");


const CreateNewCity = async (req, res) => {
    try {
        const {name} = req.body;
        const city = await createCity(name);
            return res.status(200).json({
                city: city
            });
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const getAllCities = async (req, res) => {
    try {
        const cities = await AllCities();
        return res.status(200).json({
            cities: cities
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const getCity = async (req, res) => {
    const {city_id} = req.params

    try {
        const city = await getCityService(city_id);
        return res.status(200).json({
            city
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const deleteCity = async (req, res) => {
    const {city_id} = req.params;
    try {
        const city = await deleteCityService(city_id);
        return res.status(200).json({
            city: city
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const updateCityName = async (req, res) => {
    const {city_id} = req.params;
    const {name} = req.body;
    try {
        const city = await updateCityService(city_id , name);
        return res.status(200).json({
            city: city
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    CreateNewCity , getAllCities , getCity, deleteCity , updateCityName
}