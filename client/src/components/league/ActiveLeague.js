import React, { Component } from "react";
// import { Link } from "react-router-dom";
import LeagueService from "./league-service";
import Moment from "moment";

class ActiveLeague extends Component {
  constructor(props) {
    super(props);

    this.state = {
      league: this.props.league,
      loggedInUser: this.props.loggedInUser,
      members: [],
      endDate: "03/21/2019"
    };
    this.leagueService = new LeagueService();
  }

  componentDidMount() {
    const leagueId = this.state.league._id;
    this.leagueService
      .getMembers(leagueId)
      .then(response => {
        response.sort((a, b) => b.score - a.score);
        this.setState({
          members: response
          // endDate: Moment(this.state.league.startDate, "L")
          //   .add(30, "days")
          //   .calendar()
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    if (this.state.members.length <= 0) {
      return <p>Loading</p>;
    } else {
      return (
        <div>
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
}

export default ActiveLeague;
