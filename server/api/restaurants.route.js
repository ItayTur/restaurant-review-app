const express = require('express');
const RestaurantsController = require('./restaurants.controller.js');
const ReviewsController = require('./reviews.controller.js');

const router = express.Router();

router.route('/').get(RestaurantsController.getRestaurants);
router.route('/id/:id').get(RestaurantsController.getRestaurantById);
router.route('/cuisines').get(RestaurantsController.getCuisines);

router
    .route('/reviews')
    .post(ReviewsController.addReview)
    .put(ReviewsController.updateReview)
    .delete(ReviewsController.deleteReview);

module.exports = router;