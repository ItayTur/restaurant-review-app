const express = require('express');
const RestaurantsController = require('./restaurants.controller.js')

const router = express.Router();

router.route('/').get(RestaurantsController.getRestaurants);

module.exports = router;