import React, { Component } from "react";
import { withRouter } from "react-router";

import AuthService from "../auth/auth-service";
import LeagueService from "../league/league-service";

import "bootstrap/dist/css/bootstrap.css";
import "./Archive.css";

class JoinLeague extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: this.props.userInSession,
      league: this.props.league
    };
    this.authService = new AuthService();
    this.leagueService = new LeagueService();
  }

  enterLeague = () => {
    this.leagueService
      .enterLeague(
        this.state.loggedInUser._id,
        this.state.loggedInUser.league.info
      )
      .then(response => {
        this.setState({ loggedInUser: response });
        this.props.history.push("/myleague");
      })
      .catch(err => console.log(err));
  };

  declineLeague = () => {
    let leagueId = this.state.loggedInUser.league.info;
    let memberId = this.state.loggedInUser._id;
    this.leagueService
      .deleteMember(leagueId, memberId)
      .then(response => {
        this.setState({ loggedInUser: response });
        this.props.history.push("/myleague");
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div>
        <p>
          You have been invited to join the league
          <strong> {this.state.league.name}</strong>.
        </p>
        <br />
        <button onClick={this.enterLeague}>Join league</button>
        <br />
        <button onClick={this.declineLeague}>
          I don't want to join this league.
        </button>
      </div>
    );
  }
}

export default withRouter(JoinLeague);
