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
          <footer class="page-footer font-small light-green pt-2">
    <div className="container text-center text-md-left">

       <div className="row text-center text-md-left mt-2 pb-2">

        <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-2 pr-5">
          <h6 className="text-uppercase mb-2 font-weight-bold">About</h6>
          <p>This website has been created by Janine and Luise as the second project of their part-time web-development
            bootcamp at ironhack in Berlin.</p>
        </div>

        {/* <hr className="w-100 clearfix d-md-none"/> */}

        {/* <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-2">
          <h6 className="text-uppercase mb-2 font-weight-bold">Go to</h6>
          <p>
          <Link to={'/'}> Dashboard</Link>
          </p>
          <p>
          <Link to={'/league'}> League </Link>
          </p>
          <p>
          <Link to={'/profile'}> Your profile</Link>
          </p>
        </div> */}

        {/* <hr classNames="w-100 clearfix d-md-none"/> */}

        <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-2">
          <h6 className="text-uppercase mb-2 font-weight-bold">Contact</h6>
          <p>Ironhack, Berlin</p>
          <p>waste-less.ironhack@gmail.com</p>
        </div>

      </div>

      {/* <hr/> */}

      <div className="row d-flex align-items-center">

        <div className="col-md-7 col-lg-8">

          <p class="text-center text-md-left">© 2018 Copyright:
            <strong> Janine & Luise – Ironhackers</strong>
          </p>

        </div>

        <div class="col-md-5 col-lg-4 ml-lg-0">

          <div className="text-center text-md-right">
            <ul className="list-unstyled list-inline">
              <li className="list-inline-item">
                <a className="btn-floating btn-sm rgba-white-slight mx-1">
                  <i className="fab fa-facebook-f"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a className="btn-floating btn-sm rgba-white-slight mx-1">
                  <i className="fab fa-twitter"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a classNames="btn-floating btn-sm rgba-white-slight mx-1">
                  <i className="fab fa-google-plus-g"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a className="btn-floating btn-sm rgba-white-slight mx-1">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </li>
            </ul>
        
          </div>
        </div>
      </div> 
    </div>

          </footer>

          </div>
        </div>
      );
    }
  }
}

export default App;
