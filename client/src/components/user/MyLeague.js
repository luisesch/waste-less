import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import AuthService from "../auth/auth-service";
import WaitingLeague from "../league/WaitingLeague";

import Dashboard from "../league/Dashboard";
import LeagueService from "../league/league-service";

import Moment from "moment";
import JoinLeague from "../league/JoinLeague";

class MyLeague extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: {},
      members: [],
      league: {},
      endDate: "",
      firstThree: [],
      mounted: false
    };
    this.authService = new AuthService();
    this.leagueService = new LeagueService();
  }

  componentDidMount() {
    // get logged in user and add to state
    this.authService.loggedin().then(response => {
      this.setState({
        loggedInUser: response
      });
      // if user has no league
      if (!this.state.loggedInUser.league.hasOwnProperty("info")) {
        this.setState({ league: {}, mounted: true });
        // if user has league
      } else {
        let newState = {};
        const leagueId = this.state.loggedInUser.league.info;
        //get user's league
        this.leagueService
          .getLeague(leagueId)
          .then(league => {
            newState.league = league;
            newState.mounted = true;
            return this.leagueService.getMembers(leagueId);
          })
          .then(members => {
            let sortedMembers = [...members];
            let firstThree = [];
            sortedMembers.sort((a, b) => b.score - a.score);
            firstThree = sortedMembers.slice(0, 2);
            newState.members = members;
            newState.firstThree = firstThree;
            this.setState(newState);
          })

          .catch(err => console.log(err));
      }
    });
  }

  componentDidUpdate() {
    if (
      this.state.endDate.length <= 0 &&
      this.state.league &&
      this.state.league.status === "active"
    ) {
      const leagueId = this.state.loggedInUser.league.info;
      this.leagueService
        .getLeague(leagueId)
        .then(response => {
          this.setState({
            league: response,
            endDate: Moment(response.startDate, "L")
              .add(30, "days")
              .calendar()
          });
        })
        .catch(err => console.log(err));
    }
  }

  deleteMember = () => {
    let leagueId = this.state.league._id;
    let memberId = this.state.loggedInUser._id;
    this.leagueService
      .deleteMember(leagueId, memberId)
      .then(response => console.log(response));
  };

  render() {
    if (!this.state.mounted) {
      return <p>Loading</p>;
    }
    // if user isn't part of any league
    else if (this.state.league && this.state.league.status === "active") {
      return (
        <Dashboard
          endDate={this.state.endDate}
          userInSession={this.state.loggedInUser}
          league={this.state.league}
        />
      );
    } else if (
      !this.state.league ||
      Object.entries(this.state.league).length === 0
    ) {
      return (
        <div className="card">
          <div className="createLeague card-body">
            <div className="row">
              <div className="col-md-7 left">
                <img
                  className="img-fluid rounded mb-4 mb-lg-0"
                  src="https://www.longevitylive.com/wp-content/uploads/2017/09/art-close-up-ecology-886521.jpg"
                  alt=""
                />
              </div>
              <div className="col-md-5 right">
                <h1 className="card-title font-weight-light">
                  You aren't currently member of any league.
                </h1>
                <br />
                <Link
                  to="/newleague"
                  style={{ textDecoration: "underline", color: "#1b2f33" }}
                >
                  Create new league
                </Link>

                {this.state.loggedInUser.completedLeagues.length > 0 && (
                  <p>
                    Or check out your <Link to="/archive">archive</Link>
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="card-footer text-muted">Let the games begin! </div>
        </div>
      );
      // if league has recently been completed and user has joined a new league
    } else if (!this.state.loggedInUser.league.confirmed) {
      return (
        <JoinLeague
          userInSession={this.state.loggedInUser}
          league={this.state.league}
        />
      );
    } else if (this.state.league.status === "waiting") {
      return (
        <WaitingLeague
          userInSession={this.state.loggedInUser}
          league={this.state.league}
        />
      );
    }
  }
}

export default withRouter(MyLeague);
