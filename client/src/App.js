import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
// import axios from "axios";
import { Routes, Route } from "react-router-dom";
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
      loggedInUser: null,
    };
    this.authService = new AuthService();
    this.taskService = new TaskService();
  }

  fetchUser() {
    if (this.state.loggedInUser === null) {
      this.authService
        .loggedin()
        .then((response) => {
          this.setState({
            loggedInUser: response,
          });
        })
        .catch((err) => {
          this.setState({
            loggedInUser: false,
          });
        });
    }
  }

  getTheUser = (userObj) => {
    this.setState({
      loggedInUser: userObj,
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
            <Routes>
              <Route
                exact
                path="/myleague"
                element={<ProtectedRoute user={this.state.loggedInUser} />}
              >
                <Route exact path="/myleague" element={<MyLeague />} />
              </Route>
              <Route
                exact
                path={`/confirm/:confirmationCode`}
                element={<ProtectedRoute user={this.state.loggedInUser} />}
              >
                <Route
                  exact
                  path={`/confirm/:confirmationCode`}
                  element={<Verification />}
                />
              </Route>
              <Route
                exact
                path="/welcome"
                element={<ProtectedRoute user={this.state.loggedInUser} />}
              >
                <Route exact path="/welcome" element={<Welcome />} />
              </Route>
              <Route
                exact
                path="/tasks"
                element={<ProtectedRoute user={this.state.loggedInUser} />}
              >
                <Route
                  exact
                  path="/tasks"
                  element={
                    <Tasks
                      setScore={this.raiseScore}
                      userInSession={this.state.loggedInUser}
                    />
                  }
                />
              </Route>
              <Route
                exact
                path="/newleague"
                element={<ProtectedRoute user={this.state.loggedInUser} />}
              >
                <Route
                  exact
                  path="/newleague"
                  element={
                    <CreateLeague userInSession={this.state.loggedInUser} />
                  }
                />
              </Route>
              <Route
                exact
                path="/profile"
                element={<ProtectedRoute user={this.state.loggedInUser} />}
              >
                <Route exact path="/profile" element={<Profile />} />
              </Route>
              <Route
                exact
                path="/archive"
                element={<ProtectedRoute user={this.state.loggedInUser} />}
              >
                <Route exact path="/archive" element={<Archive />} />
              </Route>
              <Route
                exact
                path="/archive/:id"
                element={<ProtectedRoute user={this.state.loggedInUser} />}
              >
                <Route exact path="/archive/:id" element={<Archive />} />
              </Route>
              <Route
                exact
                path="/profile/:id"
                element={<ProtectedRoute user={this.state.loggedInUser} />}
              >
                <Route
                  exact
                  path="/profile/:id"
                  element={<OtherUserProfile />}
                />
              </Route>
              <Route
                user={this.state.loggedInUser}
                exact
                path="/contact"
                element={<Contact />}
              />
            </Routes>
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
            <Routes>
              <Route
                user={this.state.loggedInUser}
                exact
                path="/"
                element={<HomeSignup getUser={this.getTheUser} />}
              />
              <Route
                user={this.state.loggedInUser}
                exact
                path="/login"
                element={<HomeLogin getUser={this.getTheUser} />}
              />
              <Route
                user={this.state.loggedInUser}
                exact
                path="/contact"
                element={<Contact />}
              />
            </Routes>
          </div>
          <Footer />
        </div>
      );
    }
  }
}

export default App;
