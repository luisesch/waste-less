import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import LeagueService from "../league/league-service";
import "./JoinLeague.css";

function JoinLeague(props) {
  const [loggedInUser, setLoggedInUser] = useState(props.userInSession);
  const [league] = useState(props.league);
  const leagueService = new LeagueService();
  const navigate = useNavigate();

  const enterLeague = () => {
    leagueService
      .enterLeague(loggedInUser._id, loggedInUser.league.info)
      .then((response) => {
        setLoggedInUser(response);
        navigate("/myleague");
      })
      .catch((err) => console.log(err));
  };

  const declineLeague = () => {
    let leagueId = loggedInUser.league.info;
    let memberId = loggedInUser._id;
    leagueService
      .deleteMember(leagueId, memberId)
      .then((response) => {
        setLoggedInUser(response);
        navigate("/myleague");
      })
      .catch((err) => console.log(err));
  };

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
              {league.administrator.username} has invited you to join the league
              "{league.name}"
            </h2>

            <button onClick={enterLeague} className="btn btn-lg Home-btn mb-3">
              Join league
            </button>
            <br />
            <button onClick={declineLeague} className="btn btn-lg btn-light">
              I don't want to join this league.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinLeague;
