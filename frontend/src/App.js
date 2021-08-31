import React, { useState } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { Nav, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import AddReview from "./components/addReview";
import Restaurant from "./components/restaurant";
import RestaurantsList from "./components/restaurantsList";
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
      <header className="App-header">
      </header>

      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/restaurants" className="navbar-brand">
          Restaurant Reviews
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/restaurants"} className="nav-link">Restaurants</Link>
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

      <div>
        <Switch>
          <Route 
            exact 
            path={["/", "/restaurants"]} 
            component={RestaurantsList} 
          />

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
