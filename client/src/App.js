import React, { Component } from "react";
import "./App.css";
// import axios from "axios";
import { Switch, Route } from "react-router-dom";
import Home from "./components/auth/Home";
import Signup from "./components/auth/Signup";
import Navbar from "./components/Navbar";
import AuthService from "./components/auth/auth-service";
import Dashboard from "./components/Dashboard";
import Welcome from "./components/auth/Welcome";
import Tasks from "./components/Tasks";
import Footer from "./components/Footer";

import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedInUser: null };
    this.service = new AuthService();
  }

  fetchUser() {
    if (this.state.loggedInUser === null) {
      this.service
        .loggedin()
        .then(response => {
          this.setState({
            loggedInUser: response
          });
        })
        .catch(err => {
          this.setState({
            loggedInUser: false
          });
        });
    }
  }

  getTheUser = userObj => {
    this.setState({
      loggedInUser: userObj
    });
  };

  render() {
    this.fetchUser();
    //if user is logged in
    if (this.state.loggedInUser) {
      return (
        <div className="App">
          <Navbar
            userInSession={this.state.loggedInUser}
            getUser={this.getTheUser}
          />
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <Dashboard userInSession={this.state.loggedInUser} />
              )}
            />
            <Route
              exact
              path="/welcome"
              render={() => <Welcome userInSession={this.state.loggedInUser} />}
            />
            <Route exact path="/tasks" component={Tasks} />
          </Switch>
          <Footer/>
        </div>
      );
      //if user is not logged in
    } else {
      return (
        <div className="App container-responsive fixed">
          <Navbar userInSession={this.state.loggedInUser} />
         
          <div className="rightBar container-responsive absolute">
          <Switch>
            <Route
              exact
              path="/"
              render={() => <Home getUser={this.getTheUser} />}
            />
            <Route
              exact
              path="/signup"
              render={props => <Signup {...props} getUser={this.getTheUser} />}
            />
          </Switch>
          <Footer/>
          </div>
        </div>
      );
    }
  }
}

export default App;
