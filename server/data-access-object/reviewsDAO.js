const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

let reviews;

class ReviewsDAO {
    static async injectDB(conn) {
        try {
            if (reviews) {
                return;
            }
            reviews = await conn.db(process.env.RESTREVIEWS_NS).collection('reviews');
        } catch (error) {
            console.error(`Unable to establish collection handles in userDAO: ${error}`)
        }
    }

    static async addReview(restaurantId, user, review, date) {
        try {
            const reviewToAdd = {
                name: user.name,
                user_id: user._id,
                date, 
                text: review,
                restaurant_id: ObjectId(restaurantId),
            }
            return await reviews.insertOne(reviewToAdd);
        } catch (error) {
            console.error(`Unable to post review: ${error}`);
            return { error };
        }
    }

    static async updateReview(reviewId, userInfo, review, date) {
        try {
            const updateResponse = await reviews.updateOne(
                { user_id: userInfo._id, _id: ObjectId(reviewId) },
                { $set: { text: review, date }}
            );
            return updateResponse;
        } catch (error) {
            console.error(`Unable to udpate review: ${error}`)
            return { error }
        }
    }

    static async deleteReview(reviewId, userId) {
        try {
            const deleteResponse = await reviews.deleteOne({
                _id: ObjectId(reviewId),
                user_id: userId,
            });
            return deleteResponse;
        } catch (error) {
            console.error(`Unable to delete review: ${error}`);
            return { error };
        }
    }
}

module.exports = ReviewsDAO;