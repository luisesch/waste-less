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
        <div className="row p-0 m-0">
          <div className="leftBar col-xs-12 col-md-8 pt-5">
            <h1 className="header">WASTE-LESS</h1>
            <h4 className="subheader">There is no plan(et) B</h4>
          </div>
          <div className="rightBar col-xs-12 col-md-4 pt-5 px-5">
            <Signup signup={this.signup} message={this.state.message} />
          </div>
        </div>
        <div className="about pt-3 px-5 text-right">
          <h4>About</h4>
          <p>
            You love a good challenge? Then waste-less might be just the right
            thing for you. Invite your friends, family or colleagues and compete
            against each other in avoiding waste. Whoever collects most points
            during a week, month or quarter will win the league!
            <br /> <br />
            Waste-less is not about perfection, it's about making better
            decisions – one step at a time. We believe that small efforts may
            lead to a big impact, so start with just one single change and see
            where it takes you.
          </p>
        </div>
      </div>
    );
  }
}

export default Home;
