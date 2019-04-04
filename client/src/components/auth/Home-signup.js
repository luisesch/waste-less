import React, { Component } from "react";
import AuthService from "./auth-service";
// import { Link } from "react-router-dom";
// import { Switch, Route } from "react-router-dom";

import "./Home.css";
import Signup from "./Signup";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    };
    this.service = new AuthService();
  }

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

  render() {
    return (
      <div className="Home container-fluid">
        <div className="row">
          <div className="leftBar col-xs-12 col-md-8 pt-5">
            <h1 className="header">WASTE-LESS</h1>
            <h4 className="subheader">There is no plan(et) B</h4>
          </div>
          <div className="rightBar col-xs-12 col-md-4 pt-5 px-5">
            <Signup signup={this.signup} message={this.state.message} />
          </div>
        </div>
        <div className="about p-5 text-right">
          <p>
            About - Waste-less is not about perfection; it's about making better
            decision. We believe that small efforts produce a big impact so
            start with just one single change and grow with every step.
            <br /> <br />
            You want to challenge yourself, your friends, your family or your
            colleagues? Invite them to Waste-less and compete against each
            other. Who avoids the most waste during a week, month or quarter
            wins!
            <br /> <br />
            So let's start - waste less than the others!
          </p>
        </div>
      </div>
    );
  }
}

export default Home;
