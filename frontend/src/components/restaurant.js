import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurantService";
import { Link } from "react-router-dom";

const Restaurant = props => {
  const initialRestaurantState = {
    id: null,
    name: "",
    address: {},
    cuisine: "",
    reviews: []
  };

  //Manage restaurant state
  const [restaurant, setRestaurant] = useState(initialRestaurantState);
  
  //Send request for restaurant details ONLY when restaurant ID changes
  useEffect(() => {
    getRestaurant(props.match.params.id);
  }, [props.match.params.id]);
  
  const getRestaurant = id => {
    //Submit request for restaurant info based on ID
    RestaurantDataService.get(id)
      .then(response => {
        setRestaurant(response.data);
        console.log(`Restaurant found: ${response.data}`);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteReview = (reviewId, index) => {
    //Submit request to delete review
    RestaurantDataService.deleteReview(reviewId, props.user.id)
      .then(response => {
        setRestaurant((prevState) => {
          //Remove deleted review from state
          prevState.reviews.splice(index, 1);
          return({
            ...prevState
          });
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div className="restaurant">
      {/* Ensure restaurant is selected before rendering */}
      {restaurant ? (
        <div>
          <h5>{restaurant.name}</h5>
          <p>
            <strong>Cuisine: </strong>{restaurant.cuisine}<br/>
            <strong>Address: </strong>{restaurant.address.building} {restaurant.address.street}, {restaurant.address.zipcode}
          </p>
          
          <Link 
            to={"/restaurants/" + props.match.params.id + "/review"} 
            className="btn btn-primary"
          >
            Add Review
          </Link>

          <h4>Reviews</h4>
          <div className="row">
            {/* Check if any reviews exist, then map review into cards */}
            {restaurant.reviews.length > 0 ? (
              restaurant.reviews.map((review, index) => {
                return (
                  <div 
                    className="col-lg-4 pb-1" 
                    key={index}
                  >
                    <div className="card">
                      <div className="card-body">
                        <p className="card-text">
                          {review.text}<br/>
                          <strong>User: </strong>{review.name}<br/>
                          <strong>Date: </strong>{review.date}
                        </p>
                        {props.user && props.user.id === review.user_id &&
                          <div className="row">
                            <a 
                              onClick={() => deleteReview(review._id, index)} 
                              className="btn tn-primary col-lg-5 mx-1 mb-1"
                            >
                              Delete
                            </a>
                            <Link 
                              to={{
                                pathname: "/restaurants/" + props.match.params.id + "/review",
                                state: { currentReview: review }
                              }}
                              className="btn btn-primary col-lg-5 mx-1 mb-1"
                            >
                              Edit review
                            </Link>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-sm-4">
                <p>No reviews yet!</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <br/>
          <p>No restaurant selected!</p>
        </div>
      )}
    </div>
  );
};

export default Restaurant;