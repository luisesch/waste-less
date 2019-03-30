import React, { Component } from "react";
import { withRouter } from "react-router";
import Popup from "reactjs-popup";

import LeagueService from "../league/league-service";

class LeaveLeagueButton extends Component {
  constructor(props) {
    super(props);

    this.leagueService = new LeagueService();
  }

  leaveLeague = () => {
    let leagueId = this.props.userInSession.league.info;
    let memberId = this.props.userInSession._id;
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
      <Popup
        trigger={<button className="btn btn-danger">Leave league</button>}
        position="right center"
      >
        <div>
          <p>Are you sure?</p>
          <button className="btn btn-danger" onClick={this.leaveLeague}>
            Yes!
          </button>
        </div>
      </Popup>
    );
  }
}

export default withRouter(LeaveLeagueButton);
