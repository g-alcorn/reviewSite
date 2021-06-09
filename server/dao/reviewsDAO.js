import mongodb from "mongodb";
const ObjectId = mongodb.ObjectID;

let reviews;

export default class ReviewsDAO {
  static async injectDB (conn) {
    if (reviews) {
      return;
    } try {
      reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews");
    } catch (e) {
      console.error(`Unable to establish collection handle in reviewsDAO ${e}`);
    }
  };

  static async addReview(restaurantId, user, review, date) {
    try {
      const reviewDoc = {
        name: user.name,
        user_id: user._id,
        date,
        text: review,
        restaurant_id: ObjectId(restaurantId)
      };

      await reviews;
      return await reviews.insertOne(reviewDoc);
    } catch (e) {
      console.error(`Unable to post review: ${e}`);
      return e;
    }
  };

  static async updateReview(reviewId, user_id, text, date) {
    try {
      return await reviews.updateOne(
        { user_id, 
          _id: ObjectId(reviewId) 
        },
        { $set: { text, date } }
      )
    } catch (e) {
      console.error(`Unable to update review: ${e}`);
      return e;
    }
  };

  static async deleteReview(reviewId, user_id) {
    try {
      const deleteResponse = await reviews.deleteOne({
        _id: ObjectId(reviewId),
        user_id
      });

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete review: ${e}`);
      return e;
    }
  };
}