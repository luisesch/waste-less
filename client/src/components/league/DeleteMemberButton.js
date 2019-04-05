import React, { Component } from "react";
import { withRouter } from "react-router";
import Popup from "reactjs-popup";

import LeagueService from "./league-service";

class DeleteMemberButton extends Component {
  constructor(props) {
    super(props);

    this.leagueService = new LeagueService();
  }

  deleteMember = () => {
    let leagueId = this.props.user.league.info;
    let memberId = this.props.user._id;
    this.leagueService
      .deleteMember(leagueId, memberId)
      .then(response => {
        this.props.history.push("/myleague");
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <Popup
        trigger={
          <button className="btn Home-btn">{this.props.children}</button>
        }
        position="right center"
      >
        <div>
          <p>Are you sure?</p>
          <button className="btn btn-danger" onClick={this.deleteMember}>
            Yes!
          </button>
        </div>
      </Popup>
    );
  }
}

export default withRouter(DeleteMemberButton);
