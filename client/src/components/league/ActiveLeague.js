import React, { Component } from "react";
// import { Link } from "react-router-dom";
import LeagueService from "./league-service";

class ActiveLeague extends Component {
  constructor(props) {
    super(props);

    this.state = {
      league: this.props.league,
      loggedInUser: this.props.loggedInUser,
      members: this.props.members
    };
    this.leagueService = new LeagueService();
  }

  componentDidMount() {
    const leagueId = this.state.league._id;
    this.leagueService
      .getMembers(leagueId)
      .then(response => {
        let sortedMembers = [...response];
        sortedMembers.sort((a, b) => b.score - a.score);
        this.setState({ members: sortedMembers });
      })
      .catch(err => console.log(err));
  }

  render() {
    console.log(this.state.members);
    return (
      <div>
        <h2>{this.state.league.name}</h2>
        <p>Started on: {this.state.league.startDate}</p>
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
                  <th scope="row">{index + 1}</th>
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

export default ActiveLeague;
