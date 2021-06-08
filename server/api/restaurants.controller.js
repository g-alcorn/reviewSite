import RestaurantsDAO from "../dao/restaurantsDAO.js";

export default class RestaurantsController {
  static async apiGetRestaurants (req, res, next) {
    //Convert query params to integers
    const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    //Create DB search filters from query params
    let filters = {};

    if (req.query.cuisine) {
      filters.cuisine = req.query.cuisine;
    } else if (req.query.zipcode) {
      filters.zipcode = req.query.zipcode;
    } else if (req.query.name) {
      filters.name = req.query.name;
    }

    //Execute DB query
    const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants(
      {
        filters, 
        page, 
        restaurantsPerPage
      }
    );

    //Form responose object and return in JSON format
    let response = {
      restaurants: restaurantsList,
      page,
      filters,
      entries_per_page: restaurantsPerPage,
      total_results: totalNumRestaurants
    };

    res.json(response);
  };
}