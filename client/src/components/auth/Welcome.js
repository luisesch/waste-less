import React, { Component } from "react";
import { Link } from "react-router-dom";

class Welcome extends Component {
  render() {
    return (
      <div>
        <p>Thank you for signing up, {this.props.userInSession.username}</p>{" "}
        <Link to={"/"}>Check out your dashboard</Link>
      </div>
    );
  }
}

export default Welcome;
