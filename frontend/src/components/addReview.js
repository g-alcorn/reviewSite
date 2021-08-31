import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurantService";
import { Link } from "react-router-dom";

const AddReview = props => {
  //Same page used to edit or create new reviews
  //Editing defaults to false for new review
  //Editing set to true if current review already has data
  let initialReviewState = "";
  let editing = false;

  if (props.location.state && props.location.state.currentReview) {
    editing = true;
    initialReviewState = props.location.state.currentReview.text;
  }

  const initialRestaurantState = {
    id: null,
    name: "",
    address: {},
    cuisine: "",
    reviews: []
  };

  const [restaurant, setRestaurant] = useState()
  const [review, setReview] = useState(initialReviewState);
  const [submitted, setSubmitted] = useState(false);

  //Send request for restaurant details ONLY when page initalially loads
  useEffect(() => {
    getRestaurant(props.match.params.id);
  }, []);
  
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

  //Update review data with input
  const handleInputChange = event => {
    setReview(event.target.value);
  };

  const saveReview = () => {
    let data = {
      text: review,
      name: props.user.name,
      user_id: props.user.id,
      restaurant_id: props.match.params.id
    };

    if (editing) {
      data.review_id = props.location.state.currentReview._id;
      RestaurantDataService
        .updateReview(data)
        .then(response => {
          console.log(response);
          console.log(props)
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      RestaurantDataService
        .createReview(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }    
  };

  return (
    <div>
      {/* Check for login status */}
      {props.user ? (
        <div className="submit-form">
          {/* Check if review submitted or not */}
          {submitted ? (
            <div>
              <h4>Review submitted successfully!</h4>
              <Link
                to={"/restaurants/" + props.match.params.id}
                className="btn btn-success"
              >
                Return to {restaurant.name}
              </Link>
            </div>
          ) : (
            <div>
              <div className="form-group">
                <label htmlFor="description">
                  { editing ? "Edit" : "Create" } Review
                </label>
                <input
                  type="textarea"
                  className="form-control"
                  id="text"
                  required
                  value={review}
                  onChange={handleInputChange}
                  name="text"
                />
              </div>
              <button
                onClick={saveReview}
                className="btn btn-success"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          Please log in.
        </div>
      )}
    </div>
  );
};

export default AddReview;