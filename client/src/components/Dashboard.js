import React, { Component } from "react";
import { Link } from "react-router-dom";

class Dashboard extends Component {
  render() {
    return (
      <p>
        Welcome to your dashboard, {this.props.userInSession.username} <br />
        Find new tasks <Link to="/tasks">here</Link>
      </p>
    );
  }
}

export default Dashboard;
