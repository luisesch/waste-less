import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
// import axios from "axios";
import { Switch, Route } from "react-router-dom";
import HomeSignup from "./components/auth/Home-signup";
import HomeLogin from "./components/auth/Home-login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/auth/protected-route";
import AuthService from "./components/auth/auth-service";
import Dashboard from "./components/user/Dashboard";
import Welcome from "./components/auth/Welcome";

import Tasks from "./components/tasks/Tasks";
import CreateLeague from "./components/league/CreateLeague";
import TaskService from "./components/tasks/task-service";
import Highscore from "./components/league/Highscore";
import Footer from "./components/Footer";
import Profile from "./components/user/Profile";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: null
    };
    this.authService = new AuthService();
    this.taskService = new TaskService();
  }

  fetchUser() {
    if (this.state.loggedInUser === null) {
      this.authService
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
    this.taskService
      .updateScore(newScore, this.state.loggedInUser)
      .then(response =>
        this.setState({
          loggedInUser: response
        })
      )
      .catch(err => console.log(err));
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
          <div className="fixfooter text-center">
            <Switch>
              <ProtectedRoute
                user={this.state.loggedInUser}
                exact
                path="/myleague"
                component={Dashboard}
              />
              <ProtectedRoute
                user={this.state.loggedInUser}
                exact
                path="/welcome"
                component={Welcome}
              />
              <ProtectedRoute
                user={this.state.loggedInUser}
                exact
                path="/tasks"
                component={() => <Tasks setScore={this.raiseScore} />}
              />
              <ProtectedRoute
                user={this.state.loggedInUser}
                exact
                path="/newleague"
                component={props => (
                  // only thing that's needed is id and that doesn't change
                  <CreateLeague
                    {...props}
                    userInSession={this.state.loggedInUser}
                  />
                )}
              />
              <ProtectedRoute
                user={this.state.loggedInUser}
                exact
                path="/myleague/highscore"
                component={props => (
                  <Highscore
                    userInSession={this.state.loggedInUser}
                    getUser={this.getTheUser}
                  />
                )}
              />
              <ProtectedRoute
                user={this.state.loggedInUser}
                exact
                path="/profile"
                component={Profile}
              />
            </Switch>
          </div>
          <Footer />
        </div>
      );
      //if user is not logged in
    } else {
      return (
        <div className="App">
          <Navbar userInSession={this.state.loggedInUser} />

          <div className="container-fluid">
            <Switch>
              <Route
                user={this.state.loggedInUser}
                exact
                path="/"
                component={props => (
                  <HomeSignup {...props} getUser={this.getTheUser} />
                )}
              />
              <Route
                user={this.state.loggedInUser}
                exact
                path="/login"
                component={props => (
                  <HomeLogin {...props} getUser={this.getTheUser} />
                )}
              />
              <ProtectedRoute
                user={this.state.loggedInUser}
                exact
                path="/myleague"
              />
              <ProtectedRoute
                user={this.state.loggedInUser}
                exact
                path="/newleague"
              />
              <ProtectedRoute
                user={this.state.loggedInUser}
                exact
                path="/tasks"
              />
              <ProtectedRoute
                user={this.state.loggedInUser}
                exact
                path="/profile"
              />
              <ProtectedRoute
                user={this.state.loggedInUser}
                exact
                path="/myleague/highscore"
              />
            </Switch>
            <Footer />
          </div>
        </div>
      );
    }
  }
}

export default App;
