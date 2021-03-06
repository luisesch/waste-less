import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
// import axios from "axios";
import { Switch, Route } from "react-router-dom";
import { withRouter } from "react-router";
import HomeSignup from "./components/auth/Home-signup";
import HomeLogin from "./components/auth/Home-login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/auth/protected-route";
import AuthService from "./components/auth/auth-service";
import MyLeague from "./components/user/MyLeague";
import Welcome from "./components/auth/Welcome";
import Archive from "./components/league/archive/Archive";
import Verification from "./components/auth/Verification";

import Tasks from "./components/tasks/Tasks";
import CreateLeague from "./components/league/CreateLeague";
import TaskService from "./components/tasks/task-service";
import Footer from "./components/Footer";
import Profile from "./components/user/Profile";
import Contact from "./components/contact/Contact";
import OtherUserProfile from "./components/user/OtherUserProfile";

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
              {/* <Route
                user={this.state.loggedInUser}
                exact
                path="/"
                component={props => <MyLeague {...props} />}
              /> */}
              <ProtectedRoute
                user={this.state.loggedInUser}
                exact
                path="/myleague"
                component={props => <MyLeague {...props} />}
              />
              <ProtectedRoute
                user={this.state.loggedInUser}
                exact
                path={`/confirm/:confirmationCode`}
                component={props => <Verification {...props} />}
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
                component={() => (
                  <Tasks
                    setScore={this.raiseScore}
                    userInSession={this.state.loggedInUser}
                  />
                )}
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
                path="/profile"
                component={Profile}
              />
              <ProtectedRoute
                user={this.state.loggedInUser}
                exact
                path="/archive"
                component={Archive}
              />
              <ProtectedRoute
                user={this.state.loggedInUser}
                exact
                path="/archive/:id"
                component={Archive}
              />
              <ProtectedRoute
                user={this.state.loggedInUser}
                exact
                path="/profile/:id"
                component={OtherUserProfile}
              />
              <Route
                user={this.state.loggedInUser}
                exact
                path="/contact"
                component={props => <Contact {...props} />}
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
          <div className="fixfooter text-center">
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
              <Route
                user={this.state.loggedInUser}
                exact
                path="/contact"
                component={props => <Contact {...props} />}
              />

              {/*<ProtectedRoute
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
            */}
            </Switch>
          </div>
          <Footer />
        </div>
      );
    }
  }
}

export default withRouter(App);
