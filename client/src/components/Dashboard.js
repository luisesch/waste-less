import React, { Component } from "react";

class Dashboard extends Component {
  render() {
    return (
      <p>Welcome to your dashboard, {this.props.userInSession.username}</p>
    );
  }
}

export default Dashboard;
