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
      league: {},
      members: []
    };
    this.id = props.match.params.id;
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
      })
      .catch(err => console.log(err));

    this.leagueService
      .getLeague(this.id)
      .then(response => {
        this.setState({
          league: response
        });
      })
      .catch(err => console.log(err));

    this.leagueService
      .getExMembers(this.id)
      .then(response => {
        console.log(response);
        this.setState({
          members: response
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    if (Object.entries(this.state.league).length === 0) {
      return <p>Loading.</p>;
      // if league has recently been completed and user has joined a new league
    } else {
      return (
        <div>
          <h2>Completed league: {this.state.league.name}</h2>
          {/* not working right now, will work with new date */}
          <p>Ended on: {this.state.league.endDate}</p>
          <ul>
            {this.state.members.map((member, index) => {
              return (
                <li key={index}>
                  {member.username}: {member.score}
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
  }
}

export default Archive;
