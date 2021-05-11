let restaurants;

class RestaurantsDAO {
    static async injectDB(conn) {
        try {
            if (restaurants) {
                return;
            }
            restaurants = await conn.db(proccess.env.RESTREVIEWS_NS).collection('restaurants');
        } catch (error) {
            console.error('Unable to connect, error: ', error);
        }
    }

    static async getRestaurants({
        filters = null,
        page = 0,
        restaurantsPerPage = 20,
    }) {
        let query;
        if (filters) {
            query = { $text: { $search: filters['name'] } }
        } else if ('cuisine' in filters) {
            query = { 'cuisine': { $eq: filters['cuisine'] } }
        } else if ('zipcode' in filters) {
            query = { 'address.zipcode': { $eq: filters['zipcode'] } }
        }

        try {
            cursor = restaurants.find(query);
        } catch (error) {
            console.error('Unable to issue find command, error: ', error);
            return { restaurantsList: [], totalNumRestaurants: 0 };
        }

        try {
            const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page);
            const restaurantsList = await displayCursor.toArray();
            const totalNumRestaurants = await restaurants.countDocuments(query);
            return { restaurantsList, totalNumRestaurants }
        } catch (error) {
            console.error('Unable to conver cursor to array');
            return { restaurantsList: [], totalNumRestaurants: 0 };
        }

    }
}

module.exports = RestaurantsDAO;