import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurantService";
import { Link } from "react-router-dom";
import styles from '../App.css';

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

  //Save search terms in state
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

  //Call network functionos in DataService
  const retrieveRestaurants = () => {
    RestaurantDataService
      .getAll()
      .then(response => {
        setRestaurants(response.data.restaurants);
      })
      .catch(e => {
        console.log(`Failed to retrieve restaurants: ${e}`);
      });
  };

  //Retrieve data for dropdown menu
  const retrieveCuisines = () => {
    RestaurantDataService
      .getCuisines()
      .then(response => {
        setCuisines(["All cuisines"].concat(response.data));
      })
      .catch(e => {
        console.log(`Failed to retrieve cuisines: ${e}`);
      });
  };

  const refreshList = () => {
    retrieveRestaurants();
  };

  //Transmit search terms
  const find = (query, by) => {
    RestaurantDataService
      .find(query, by)
      .then(response => {
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

  //Allows enter key to trigger search
  const handleEnterPress = (event) => {
    if(event.key === "Enter") {
      switch(event.nativeEvent.target.attributes[2].nodeValue) {
        case "Search by name":
          findByName();
          break;

        case "Search by ZIP":
          findByZip();
          break;
      };
    }
  };

  return (
    <div id="restaurantsList">
      {}
      <div className="searchbar row pb-1">
    <div className="input-group col mb-1">
      <input
        text="text"
        className="form-control"
        placeholder="Search by name"
        value={searchName}
        onChange={onChangeSearchName}
        onKeyPress={handleEnterPress}
      />
      <div className="input-group-append">
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={findByName}
        >
          Search
        </button>
      </div>
    </div>
    <div className="input-group col mb-1">
      <input
        type="text"
        className="form-control"
        placeholder="Search by ZIP"
        value={searchZip}
        onChange={onChangeSearchZip}
        onKeyPress={handleEnterPress}
      />
      <div className="input-group-append">
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={findByZip}
        >
          Search
        </button>
      </div>
    </div>
    <div className="input-group col mb-1">
      <select onChange={onChangeSearchCuisine}>
        {cuisines.map(cuisine =>{
          return (
            <option value={cuisine}>
              {cuisine.substr(0,20)}
            </option>
          );
        })}
      </select>
      <div className="input-group-append">
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={findByCuisine}
        >
        Search 
        </button>
      </div>
    </div>
  </div>
      <div className="row">
        {restaurants.map((restaurant) => {
          const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`;
          const addressSearch = `${restaurant.address.building}\+${restaurant.address.street}\+${restaurant.address.zipcode}`;
          return (
            <div className="col-lg-4 pb-1">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <p className="card-text">
                    <strong>Cuisine: </strong>{restaurant.cuisine}<br/>
                    <strong>Address: </strong>{address}
                  </p>
                  <div className="row">
                    <Link 
                      to={"/restaurants/"+restaurant._id} 
                      className="btn btn-primary col-lg-5 mx-1 mb-5"
                    >
                      View Reviews
                    </Link>
                    <a 
                      target="a_blank" 
                      href={"https://www.google.com/maps/place/\""+addressSearch+"\""} 
                      className="btn btn-primary col-lg-5 mx-1 mb-4"
                    >
                      View on Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default RestaurantsList;