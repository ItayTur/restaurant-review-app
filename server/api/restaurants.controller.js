const RestaurantsDAO = require('../data-access-object/restaurantsDAO')

class RestaurantsController {
    static async getRestaurants(req, res) {
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 0;
        let filters = {};
          if (req.query.cuisine) {
              filters.cuisine = req.query.cuisine;
          } else if (req.query.zipcode) {
              filters.zipcode = req.query.zipcode;
          } else if (req.query.name) {
              filters.name = req.query.name;
          }

        const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants({ filters, page, restaurantsPerPage });
        const response = {
            restaurants: restaurantsList,
            page,
            filters,
            enteries_per_page: restaurantsPerPage,
            total_results: totalNumRestaurants,
        };

        res.json(response);
    }

    static async getRestaurantById(req, res) {
        try {
            const id = req.params.id || {};
            const restaurant = await RestaurantsDAO.getRestaurantById(id);
            if (!restaurant) {
                throw new Error(`Unable to find restaurant with id: ${id}`);
            }
            res.json(restaurant);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async getCuisines(req, res) {
        try {
            const cuisines = await RestaurantsDAO.getCuisines();
            res.json(cuisines);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }
}

module.exports = RestaurantsController;