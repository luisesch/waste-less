import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "../auth/auth-service";
import LeagueService from "../league/league-service";
import "bootstrap/dist/css/bootstrap.css";

class Archive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: {},
      leagues: []
    };
    this.authService = new AuthService();
    this.leagueService = new LeagueService();
  }

  componentDidMount() {
    // get logged in user and add to state
    this.authService
      .loggedin()
      .then(response => {
        this.setState({
          loggedInUser: response
        });
        this.leagueService
          .getArchive(this.state.loggedInUser._id)
          .then(response => {
            response.completedLeagues.reverse();
            this.setState({ leagues: response.completedLeagues });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <h2>Completed leagues</h2>
        <ul>
          {this.state.leagues.map((league, index) => {
            return <li key={index}>{league.name}</li>;
          })}
        </ul>
      </div>
    );
  }
}

export default Archive;
