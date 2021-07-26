import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurantService";
import { Link } from "react-router-dom";
import axios from "axios";

const RestaurantsList = props => {
  //Establish variables to be stored in app state
  const [ restaurants, setRestaurants ] = useState([]);
  const [ searchName, setSearchName ] = useState("");
  const [ searchZip, setSearchZip ] = useState("");
  const [ searchCuisine, setSearchCuisine ] = useState("");
  const [ cuisines, setCuisines ] = useState(["All cuisines"]);

  //Hooks to execute network ops after rendering
  useEffect(() => {
    retrieveRestaurants();
    retrieveCuisines();
  }, []);

  const onChangeSearchName = input => {
    const searchName = input.target.value;
    setSearchName(searchName);
  };

  const onChangeSearchCuisine = input => {
    const cuisineName = input.target.value;
    setSearchCuisine(cuisineName);
  };

  const onChangeSearchZip = input => {
    const searchZip = input.target.value;
    setSearchZip(searchZip);
  };

  const retrieveRestaurants = () => {
    RestaurantDataService
      .getAll()
      .then(response => {
        console.log('All restaurants retrieved');
        setRestaurants(response.data.restaurants);
      })
      .catch(e => {
        console.log(`Failed to retrieve restaurants: ${e}`);
      });
  };

  const retrieveCuisines = () => {
    RestaurantDataService
      .getCuisines()
      .then(response => {
        console.log('Cuisines retrieved');
        setCuisines(["All cuisines"].concat(response.data));
      })
      .catch(e => {
        console.log(`Failed to retrieve cuisines: ${e}`);
      });
  };

  const refreshList = () => {
    retrieveRestaurants();
  };

  const find = (query, by) => {
    RestaurantDataService
      .find(query, by)
      .then(response => {
        console.log(`Find success: ${response.data}`);
        setRestaurants(response.data.restaurants);
      })
      .catch(e => {
        console.log(`Failed to find "${query}" by "${by}`);
      });
  };

  const findByName = () => {
    find(searchName, "name");
  };

  const findByCuisine = () => {
    if(searchCuisine === "All cuisines") {
      refreshList();
    } else {
      find(searchCuisine, "cuisine");
    }
  };

  const findByZip = () => {
    find(searchZip, "zipcode");
  };

  return (
    <div className="restaurantsList">
      A
    </div>
  );
};

export default RestaurantsList;