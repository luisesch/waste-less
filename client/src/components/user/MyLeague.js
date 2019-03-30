import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import AuthService from "../auth/auth-service";
import WaitingLeague from "../league/WaitingLeague";

import "bootstrap/dist/css/bootstrap.css";
import "./Dashboard.css";
import Dashboard from "./Dashboard";
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
      endDate: "03/21/2019",
      firstThree: []
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
        this.setState({ league: false });
        // if user has league
      } else {
        const leagueId = this.state.loggedInUser.league.info;
        //get user's league
        this.leagueService
          .getLeague(leagueId)
          .then(response => {
            this.setState({
              league: response
            });
          })
          .catch(err => console.log(err));

        this.leagueService
          .getMembers(leagueId)
          .then(response => {
            let sortedMembers = [...response];
            let firstThree = [];
            sortedMembers.sort((a, b) => b.score - a.score);
            firstThree = sortedMembers.slice(0, 2);
            this.setState({ members: response, firstThree: firstThree });
          })
          .catch(err => console.log(err));
      }
    });
  }

  componentDidUpdate() {
    if (
      this.state.endDate.length <= 0 &&
      this.state.league.status === "active"
    ) {
      const leagueId = this.state.loggedInUser.league.info;
      this.leagueService
        .getLeague(leagueId)
        .then(response => {
          this.setState({
            league: response
            // endDate: Moment(response.startDate, "L")
            //   .add(30, "days")
            //   .calendar()
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

  // check, if league is over/30 days have passed
  leagueOver = () => {
    const leagueId = this.state.league._id;
    if (
      (Moment().format("L") === this.state.endDate ||
        Moment(this.state.endDate, "L")
          .fromNow()
          .indexOf("ago") >= 0) &&
      this.state.league.status === "active"
    ) {
      this.leagueService
        .endLeague(leagueId)
        .then(response => {
          this.setState({
            league: response
          });
        })
        .catch(err => console.log(err));
    }
  };

  render() {
    if (this.state.league === null) {
      return <p>Loading</p>;
    }
    // if user isn't part of any league
    else if (
      !this.state.league ||
      Object.entries(this.state.league).length === 0
    ) {
      return (
        <div>
          <p>You aren't currently member of any league.</p>
          <Link to="/newleague">Create new league</Link>
        </div>
      );
      // if league has recently been completed and user has joined a new league
    } else if (this.state.league.status === "completed") {
      return (
        <div>
          <p>
            League {this.state.league.name} has been completed -
            congratulations!
          </p>
          <Link to="/newleague">
            <button onClick={this.deleteMember}>
              Create new league or get invited to new leagues.
            </button>
          </Link>
          <br />
          <Link to={`/archive/${this.state.league._id}`}>
            Check out the results here
          </Link>
        </div>
      );
      // if user has been invited to join league, but not confirmed yet
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
    } else {
      this.leagueOver();
      return (
        <Dashboard
          endDate={this.state.endDate}
          userInSession={this.state.loggedInUser}
          league={this.state.league}
        />
      );
    }
  }
}

export default withRouter(MyLeague);
