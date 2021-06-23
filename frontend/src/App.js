import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import { Nav, Button } from "react-bootstrap/Nav";
import 'bootstrap/dist/css/bootstrap.min.css';

import AddReview from "./components/addReview";
import Restaurant from "./components/restaurant";
import RestaurantsList from "./components/restaurantsList";
import Login from "./components/login";

function App() {
  const [user, setUser] = React.useState(null);

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

      <Nav className="navbar navbar-expand navbar-dark bg-dark">
        <Nav.Item>
          <Nav.Link href="/restaurants">Restaurant Reviews</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          { user ? (
            <Nav.Link href="/logout" onClick={logout}>Logout {user.name}</Nav.Link>
          ) : (
            <Nav.Link href="/login">Login</Nav.Link>
          )}
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default App;
