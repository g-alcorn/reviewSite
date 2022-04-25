import React, { useState } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { Nav, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import AddReview from "./components/addReview";
import Restaurant from "./components/restaurant";
import RestaurantsList from "./components/restaurantsList";
//import RestaurantsSearch from "./components/restaurantSearch";
import Login from "./components/login";

function App() {
  const [user, setUser] = useState(null);

  async function login(user = null) {
    setUser(user);
  };

  async function logout() {
    setUser(null);
  };

  return (
    <div className="App">
      <nav className="navbar navbar-expand navbar-dark bg-dark mb-2">
        <div className="navbar-nav">     
          <a href="/restaurants" className="navbar-brand">
            Presto Resto
          </a>
          <li className="nav-link">
            Restaurant Reviews
          </li>
          <li className="nav-item" >
            { user ? (
              <a onClick={logout} className="nav-link" style={{cursor:'pointer'}}>
                Logout {user.name}
              </a>
            ) : (            
            <Link to={"/login"} className="nav-link">Login</Link>
            )}
          </li>
        </div>
      </nav>

      <div className="container">
        <Switch>
          <Route 
            exact 
            path={["/", "/restaurants"]} 
            component={RestaurantsList} 
          >
          </Route>

          <Route
            path="/restaurants/:id/review"
            render={(props) => (
              <AddReview {...props} user={user} />
            )}
          />

          <Route
            path="/restaurants/:id"
            render={(props) => (
              <Restaurant {...props} user={user} />
            )}
          />

          <Route 
            path="/login"
            render={(props) => (
              <Login {...props} login={login} />
            )}
          />
        </Switch>
      </div>
    </div>
  );
};

export default App;
