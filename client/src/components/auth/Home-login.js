import React, { Component } from "react";
import AuthService from "./auth-service";
// import { Link } from "react-router-dom";
// import { Switch, Route } from "react-router-dom";
import Login from "./Login";
import "bootstrap/dist/css/bootstrap.css";
import "./Home.css";
import Signup from "./Signup";

class Home extends Component {
  constructor(props) {
    super(props);
    this.service = new AuthService();
  }

  login = (username, password) => {
    this.service
      .login(username, password)
      .then(response => {
        this.props.getUser(response);
      })
      .catch(error => console.log(error));
  };

  signup = (username, password) => {
    this.service.signup(username, password).then(response => {
      if (response.message) {
        this.setState({ message: response.message });
      } else {
        this.setState({
          username: "",
          password: "",
          message: ""
        });
        this.props.getUser(response);
        this.props.history.push("/welcome");
      }
    });
  };

  render() {
    return (
      <div className="Home">
        <div className="row">
          <div className="leftBar col-xs-12 col-md-7 pt-5">
            <h1 className="header">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy
            </h1>
          </div>
          <div className="rightBar col-xs-12 col-md-5 pt-5 px-5">
            <Login login={this.login} />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
