import React, { Component } from "react";
// import { Link } from "react-router-dom";
import LeagueService from "./league-service";
import UserService from "../user/user-service";
import AuthService from "../auth/auth-service";
import { Link } from "react-router-dom";

import ActiveLeague from "./ActiveLeague";

class MyLeague extends Component {
  constructor(props) {
    super(props);

    this.state = {
      league: {},
      members: [],
      loggedInUser: null
    };
    this.leagueService = new LeagueService();
    this.userService = new UserService();
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
        // if user has no league
        if (!this.state.loggedInUser.league.hasOwnProperty("info")) {
          this.setState({ league: false });
          // if user has league
        } else {
          const leagueId = this.state.loggedInUser.league.info;
          //get user's league
          this.leagueService
            .getLeague(leagueId)
            .then(response => {
              this.setState({ league: response });
            })
            .catch(err => console.log(err));

          this.leagueService
            .getMembers(leagueId)
            .then(response => this.setState({ members: response }))
            .catch(err => console.log(err));

          this.userService.showAll().then(response => {
            this.setState({ users: response });
          });
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    if (this.state.loggedInUser === null) {
      return <p>Loading</p>;
    } else {
      //if state doesn't exist or is still empty - to avoid bug"
      if (
        !this.state.league ||
        Object.entries(this.state.league).length === 0 ||
        this.state.league.status === "completed"
      ) {
        return (
          <div>
            <p>You aren't currently member of any league.</p>
            <Link to="/newleague">Create new league</Link>
          </div>
        );
      } else if (!this.state.loggedInUser.league.confirmed) {
        return (
          <p>
            You have been invited to join the league
            <strong>{this.state.league.name}</strong>.
            <br />
            <button onClick={this.enterLeague}>Join league</button>
          </p>
        );
      } else {
        if (this.state.league.status === "active") {
          return (
            <ActiveLeague
              loggedInUser={this.state.loggedInUser}
              league={this.state.league}
              members={this.state.members}
            />
          );
        }
      }
    }
  }
}

export default MyLeague;
