let restaurants;

export default class RestaurantsDAO {
  //Establish asynchronous connection with DB to search within restaurants collection
  static async injectDB (conn) {
    if (restaurants) {
      //Cancel connection process if restaurants already loaded
      return;
    } try {
      restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants");
    } catch (e) {
      console.error(`Unable to establish collection handle in restaurantsDAO: ${e}`);
    }
  };

  //Searches database with search terms
  static async getRestaurants ({
    filters = null,
    page = 0,
    restaurantsPerPage = 20,
  } = {}) {
    let query;

    //Builds DB query depending on which filters are selected by user
    if (filters) {
      if ("name" in filters) {
        //Searches DB entries for matching terms
        query = { $text: { $search: filters["name"] } };
      }
      else if ("cuisine" in filters) {
        //Finds restaurants with cuisine matching search term
        query = { "cuisine": { $eq: filters["cuisine"] } };
      }
      else if ("zipcode" in filters) {
        //Finds restaurants with zipcode matching search term
        query = { "address.zipcode": { $eq: filters["zipcode"] } };
      }
    }

    let cursor;

    //Execute DB search and save results in cursor
    try {
      cursor = await restaurants.find(query);
    } catch (e) {
      console.error(`Unable to issue find command: ${e}`);
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }

    //Determine which restaurants to show in page
    const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page);

    try {
      //If DB search is successful, convert results in cursor to array and count the results
      const restaurantsList = await displayCursor.toArray();
      const totalNumRestaurants = await restaurants.countDocuments(query);

      return {restaurantsList, totalNumRestaurants};
    } catch (e) {
      console.error(`Unable to convert cursor to array, or problem counting documents: ${e}`);
      
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }
  };
}