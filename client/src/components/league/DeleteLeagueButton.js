import React, { Component } from "react";
import { withRouter } from "react-router";
import Popup from "reactjs-popup";

import LeagueService from "./league-service";

class DeleteMemberButton extends Component {
  constructor(props) {
    super(props);

    this.leagueService = new LeagueService();
  }

  deleteLeague = () => {
    let leagueId = this.props.league._id;
    this.leagueService
      .deleteLeague(leagueId)
      .then(response => {
        this.props.history.push("/myleague");
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <Popup
        trigger={
          <button className="btn btn-light mx-2">{this.props.children}</button>
        }
        position="left center"
      >
        <div>
          <p>Are you sure?</p>
          <button className="btn btn-danger" onClick={this.deleteLeague}>
            Yes!
          </button>
        </div>
      </Popup>
    );
  }
}

export default withRouter(DeleteMemberButton);
