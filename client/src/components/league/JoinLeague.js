import React, { Component } from "react";
import { withRouter } from "react-router";

import AuthService from "../auth/auth-service";
import LeagueService from "../league/league-service";

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
      <div className="card container">
      <div className="createLeague card-body">
        <div className="row">
          <div className="col-md-7 left">
            <img
              className="img-fluid rounded mb-4 mb-lg-0"
              src="https://cdn.shopify.com/s/files/1/2782/5894/products/plastic-free-zero-waste-gift-bundle-eco-friendly-gifts-online-the-clean-collective.jpg?v=1542850526"
              alt=""
            />
          </div>
          <div className="col-md-5 right">
            <h1 className="card-title font-weight-light">
            You have been invited to join the league
            </h1>
            <h3><strong> {this.state.league.name}</strong></h3>
            <br />
            <br />
        <button 
        onClick={this.declineLeague}
        className="form-control btn btn-light"
        >
          I don't want to join this league.
        </button>
        </div>
        </div>
        </div>
        <div className="card-footer text-muted">Let the games begin! </div>
        </div>
    );
  }
}

export default withRouter(JoinLeague);
