import React, { Component } from "react";
import { withRouter } from "react-router";

import AuthService from "../auth/auth-service";
import WaitingLeague from "../league/WaitingLeague";

import Dashboard from "../league/Dashboard";
import LeagueService from "../league/league-service";
import NoLeague from "../league/NoLeague";

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
      mounted: false,
    };
    this.authService = new AuthService();
    this.leagueService = new LeagueService();
  }

  componentDidMount() {
    // get logged in user and add to state
    this.authService.loggedin().then((response) => {
      console.log(response);
      this.setState({
        loggedInUser: response,
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
          .then((league) => {
            newState.league = league;
            newState.mounted = true;
            return this.leagueService.getMembers(leagueId);
          })
          .then((members) => {
            let sortedMembers = [...members];
            let firstThree = [];
            sortedMembers.sort((a, b) => b.score - a.score);
            firstThree = sortedMembers.slice(0, 2);
            newState.members = members;
            newState.firstThree = firstThree;
            this.setState(newState);
          })

          .catch((err) => console.log(err));
      }
    });
  }

  // componentDidUpdate() {
  //   if (
  //     // this.state.endDate.length <= 0 &&
  //     this.state.league &&
  //     this.state.league.status === "active"
  //   ) {
  //     const leagueId = this.state.loggedInUser.league.info;
  //     this.leagueService
  //       .getLeague(leagueId)
  //       .then(response => {
  //         this.setState({
  //           league: response
  //         });
  //       })
  //       .catch(err => console.log(err));
  //   }
  // }

  deleteMember = () => {
    let leagueId = this.state.league._id;
    let memberId = this.state.loggedInUser._id;
    this.leagueService
      .deleteMember(leagueId, memberId)
      .then((response) => console.log(response));
  };

  render() {
    if (!this.state.mounted) {
      return <p>Loading...</p>;
    }
    // if user isn't part of any league
    else if (
      this.state.league &&
      this.state.loggedInUser.league.confirmed &&
      this.state.league.status === "active"
    ) {
      return (
        <Dashboard
          endDate={this.state.league.endDate}
          userInSession={this.state.loggedInUser}
          league={this.state.league}
        />
      );
    } else if (
      !this.state.league ||
      Object.entries(this.state.league).length === 0
    ) {
      return <NoLeague user={this.state.loggedInUser} />;
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
