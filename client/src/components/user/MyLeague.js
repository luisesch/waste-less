import React, { useState, useEffect } from "react";

import AuthService from "../auth/auth-service";
import WaitingLeague from "../league/WaitingLeague";

import Dashboard from "../league/Dashboard";
import LeagueService from "../league/league-service";
import NoLeague from "../league/NoLeague";

import JoinLeague from "../league/JoinLeague";

function MyLeague() {
  const [loggedInUser, setLoggedInUser] = useState({});
  const [members, setMembers] = useState([]);
  const [league, setLeague] = useState({});
  const [firstThree, setFirstThree] = useState([]);
  const [mounted, setMounted] = useState(false);
  const authService = new AuthService();
  const leagueService = new LeagueService();

  useEffect(() => {
    // get logged in user and add to state
    authService.loggedin().then((response) => {
      setLoggedInUser(response);
      // if user has no league
      if (!response.league.hasOwnProperty("info")) {
        setLeague({});
        setMounted(true);
        // if user has league
      } else {
        const leagueId = response.league.info;
        //get user's league
        leagueService
          .getLeague(leagueId)
          .then((league) => {
            setLeague(league);
            setMounted(true);
            return leagueService.getMembers(leagueId);
          })
          .then((members) => {
            let sortedMembers = [...members];
            let firstThree = [];
            sortedMembers.sort((a, b) => b.score - a.score);
            firstThree = sortedMembers.slice(0, 2);
            setMembers(members);
            setFirstThree(firstThree);
          })

          .catch((err) => console.log(err));
      }
    });
  }, []);

  if (!mounted) {
    return <p>Loading...</p>;
  }
  // if user isn't part of any league
  else if (
    league &&
    loggedInUser.league.confirmed &&
    league.status === "active"
  ) {
    return (
      <Dashboard
        endDate={league.endDate}
        userInSession={loggedInUser}
        league={league}
      />
    );
  } else if (!league || Object.entries(league).length === 0) {
    return <NoLeague user={loggedInUser} />;
    // if league has recently been completed and user has joined a new league
  } else if (!loggedInUser.league.confirmed) {
    return <JoinLeague userInSession={loggedInUser} league={league} />;
  } else if (league.status === "waiting") {
    return <WaitingLeague userInSession={loggedInUser} league={league} />;
  }
}

export default MyLeague;
