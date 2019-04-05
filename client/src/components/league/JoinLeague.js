import React, { Component } from "react";
import { withRouter } from "react-router";

import AuthService from "../auth/auth-service";
import LeagueService from "../league/league-service";
import "./JoinLeague.css";

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
      <div className="mt-3">
        <div className="container px-5">
          <div className="row noborder">
            <div className="col-md-7 col-xs-12 left">
              <img
                className="img-fluid rounded Join-img"
                src="https://cdn.shopify.com/s/files/1/2782/5894/products/plastic-free-zero-waste-gift-bundle-eco-friendly-gifts-online-the-clean-collective.jpg?v=1542850526"
                alt=""
              />
            </div>
            <div className="col-md-5 col-xs-12 right">
              <h2 className="font-weight-light Quicksand mb-5">
                {this.state.league.administrator.username} has invited you to
                join the league "{this.state.league.name}"
              </h2>

              <button
                onClick={this.enterLeague}
                className="btn btn-lg Home-btn mb-3"
              >
                Join league
              </button>
              <br />
              <button
                onClick={this.declineLeague}
                className="btn btn-lg btn-light"
              >
                I don't want to join this league.
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(JoinLeague);
