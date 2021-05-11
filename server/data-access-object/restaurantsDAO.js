let restaurants;

class RestaurantsDAO {
    static async injectDB(conn) {
        try {
            if (restaurants) {
                return;
            }
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection('restaurants');
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
            if ('name' in filters) {
                query = { $text: { $search: filters['name'] } }
            } else if ('cuisine' in filters) {
                query = { 'cuisine': { $eq: filters['cuisine'] } }
            } else if ('zipcode' in filters) {
                query = { 'address.zipcode': { $eq: filters['zipcode'] } }
            }
        }
        let cursor;
        try {
            cursor = restaurants.find(query);
        } catch (error) {
            console.error('Unable to issue find command, error: ', error);
            return { restaurantsList: [], totalNumRestaurants: 0 };
        }

        try {
            const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page);
            const restaurantsList = await displayCursor.toArray();
            const totalNumRestaurants = page === 0 ? await restaurants.countDocuments(query) : 0;
            return { restaurantsList, totalNumRestaurants }
        } catch (error) {
            console.error('Unable to convert cursor to array, error:', error);
            return { restaurantsList: [], totalNumRestaurants: 0 };
        }

    }
}

module.exports = RestaurantsDAO;