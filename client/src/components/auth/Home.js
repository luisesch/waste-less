import React, { Component } from "react";
import AuthService from "./auth-service";
// import { Link } from "react-router-dom";
// import { Switch, Route } from "react-router-dom";

import "./Home.css";
import Signup from "./Signup";
import Login from "./Login";

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

  signup = (username, password, email) => {
    this.service.signup(username, password, email).then(response => {
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

  changeView = link => {
    this.props.changeView(link);
  };

  render() {
    return (
      <div className="Home container-fluid">
        <div className="row">
          <div className="leftBar col-xs-12 col-md-8 pt-5">
            <h1 className="header">WASTE-LESS</h1>
            <h4 className="subheader">There is no plan(et) B</h4>
          </div>

          <div className="rightBar col-xs-12 col-md-4 pt-5 px-5">
            {this.props.view === "signup" ? (
              <Signup signup={this.signup} changeView={this.props.changeView} />
            ) : (
              <Login login={this.login} changeView={this.props.changeView} />
            )}
          </div>
        </div>
        <div className="about p-5">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and
          </p>
        </div>
      </div>
    );
  }
}

export default Home;
