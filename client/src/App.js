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
import CreateLeague from "./components/CreateLeague";

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

  raiseScore = points => {
    let newScore = this.state.loggedInUser.score + points;
    console.log(newScore);
    this.setState({
      loggedInUser: {
        score: newScore
      }
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
            <Route
              exact
              path="/tasks"
              render={() => <Tasks setScore={this.raiseScore} />}
            />
            <Route
              exact
              path="/newteam"
              render={props => (
                <CreateLeague
                  {...props}
                  userInSession={this.state.loggedInUser}
                />
              )}
            />
          </Switch>
        </div>
      );
      //if user is not logged in
    } else {
      return (
        <div className="App">
          <Navbar userInSession={this.state.loggedInUser} />
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
        </div>
      );
    }
  }
}
export default App;
