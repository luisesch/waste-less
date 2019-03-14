import React, { Component } from "react";
import { Link } from "react-router-dom";

class Dashboard extends Component {
  render() {
    return (
      <p>
        Welcome to your dashboard, {this.props.userInSession.username} <br />
        Find new tasks <Link to="/tasks">here</Link>
        Create new league <Link to="/newteam">here</Link>
        Check out your league <Link to="/league">here</Link>
      </p>
    );
  }
}

export default Dashboard;
