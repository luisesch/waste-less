import React, { Component } from "react";
// import { Link } from "react-router-dom";
import LeagueService from "./league-service";
import Moment from "moment";
import DeleteMemberButton from "./DeleteMemberButton";
import DeleteLeagueButton from "./DeleteLeagueButton";

class ActiveLeague extends Component {
  constructor(props) {
    super(props);

    this.state = {
      league: {},
      loggedInUser: this.props.userInSession,
      members: [],
      endDate: "",
      edit: false
    };
    this.leagueService = new LeagueService();
  }

  componentDidMount() {
    const leagueId = this.state.loggedInUser.league.info;
    const newState = {};
    this.leagueService
      .getLeague(leagueId)
      .then(response => {
        newState.league = response;
        newState.endDate = Moment(response.startDate, "L")
          .add(30, "days")
          .calendar();
        return this.leagueService.getMembers(leagueId);
      })
      .then(response2 => {
        response2.sort((a, b) => b.score - a.score);
        newState.members = response2;
        this.setState(newState);
      })
      .catch(err => console.log(err));
  }

  changeEdit = () => {
    this.state.edit
      ? this.setState({ edit: false })
      : this.setState({ edit: true });
  };

  render() {
    if (Object.entries(this.state.league).length === 0) {
      return <p>Loading</p>;
    } else {
      return (
        <div>
          {this.state.loggedInUser._id ===
          this.state.league.administrator._id ? (
            <div className="text-right">
              <button
                className={
                  this.state.edit
                    ? "btn btn-primary mx-2"
                    : "btn btn-light mx-2"
                }
                onClick={this.changeEdit}
              >
                {this.state.edit ? "Done" : "Edit"}
              </button>
              <DeleteLeagueButton league={this.state.league}>
                Delete
              </DeleteLeagueButton>
            </div>
          ) : null}
          <h2>{this.state.league.name}</h2>
          <p>Started on: {this.state.league.startDate}</p>
          <p>Ends {Moment(this.state.endDate, "L").fromNow()}</p>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">Member</th>
                <th scope="col">Score</th>
              </tr>
            </thead>
            <tbody>
              {this.state.members.map((member, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">
                      {this.state.edit &&
                      member._id !== this.state.loggedInUser._id ? (
                        <DeleteMemberButton user={member}>
                          Delete
                        </DeleteMemberButton>
                      ) : (
                        <p>{index + 1}</p>
                      )}
                    </th>
                    <td>{member.username}</td>
                    <td>{member.score}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }
  }
}

export default ActiveLeague;
