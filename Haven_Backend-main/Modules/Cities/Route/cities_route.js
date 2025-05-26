const express = require('express');
const router = express.Router();
const {createCity, getCityById} = require("../Validation/cities_validation")
const validate = require("../../Validation_result/validation_result")
const {CreateNewCity , getAllCities, getCity , deleteCity , updateCityName} = require("../Controller/cities_controller")


router.post('/add' , createCity , validate , CreateNewCity)
router.get('/getAll' , getAllCities)
router.get('/:city_id' , getCityById , validate , getCity)
router.delete('/:city_id' , getCityById , validate , deleteCity)
router.put('/:city_id' , getCityById , validate , updateCityName)

module.exports = router;