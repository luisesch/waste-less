import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "../auth/auth-service";

class Dashboard extends Component {
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
      <p>
        Welcome to your dashboard, {this.state.loggedInUser.username} <br />
        Find new tasks <Link to="/tasks">here</Link>
        Create new league <Link to="/newleague">here</Link>
        Check out your league <Link to="/league">here</Link>
      </p>
    );
  }
}

export default Dashboard;
