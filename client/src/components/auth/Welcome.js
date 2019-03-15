import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "../auth/auth-service";

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedInUser: {} };
    this.authService = new AuthService();
  }

  componentDidMount() {
    // get logged in user and add to state
    this.authService
      .loggedin()
      .then(response => {
        this.setState({
          loggedInUser: response
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <p>Thank you for signing up, {this.state.loggedInUser.username}</p>
        <Link to={"/"}>Check out your dashboard</Link>
      </div>
    );
  }
}

export default Welcome;
