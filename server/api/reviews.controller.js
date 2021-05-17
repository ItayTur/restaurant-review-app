const ReviewsDAO = require('../data-access-object/reviewsDAO');

class ReviewsController {
    static async addReview(req, res) {
        try {
            const restaurantId = req.body.restaurant_id;
            const review = req.body.text;
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id,
            };
            const date = new Date();
            const reviewResponse = await ReviewsDAO.addReview(
                restaurantId,
                userInfo,
                review,
                date,
            );
            if (reviewResponse.error) {
                throw new Error(reviewResponse.error)
            }
            res.json({ status: 'success' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateReview(req, res) {
        try {
            const reviewId = req.body.review_id;
            const review = req.body.text;
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id,
            }
            const date = new Date();

            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                userInfo,
                review,
                date,
            );
            var { error } = reviewResponse;
            if (error) {
                res.status(400).json({ error });
            }

            if (reviewResponse.modifiedCount === 0) {
                throw new Error(
                    "unable to update review - user may not be original poster"
                )
            }
            res.json({ status: 'success' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteReview(req, res) {
        try {
            const reviewId = req.query.id;
            const userId = req.body.user_id;
            console.log(reviewId);
            const reviewResponse = await ReviewsDAO.deleteReview(
                reviewId,
                userId,
            );
            res.json({ status: 'success' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ReviewsController;