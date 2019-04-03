import React, { Component } from "react";
import AuthService from "../../auth/auth-service";
import LeagueService from "../league-service";

class Archive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: {},
      league: {},
      members: []
    };
    this.authService = new AuthService();
    this.leagueService = new LeagueService();
  }

  componentDidMount() {
    // get logged in user and add to state
    this.authService
      .loggedin()
      .then(response => {
        this.setState({
          loggedInUser: response
        });
      })
      .catch(err => console.log(err));

    this.getLeague(true);
  }

  // if league has changed, get league and members again
  getLeague = mounting => {
    if (mounting || this.props.id !== this.state.league._id) {
      const newState = {};
      this.leagueService
        .getLeague(this.props.id)
        .then(response => {
          newState.league = response;
          return this.leagueService.getExMembers(this.props.id);
        })
        .then(response2 => {
          newState.members = response2;
          this.setState(newState);
        })
        .catch(err => console.log(err));
    }
  };

  render() {
    if (Object.entries(this.state.league).length === 0) {
      return <p>Loading.</p>;
      // if league has recently been completed and user has joined a new league
    } else {
      this.getLeague();
      return (
        <div className="container">
          <div className="row p-3">
            <div className="col-md-4 col-xs-12 text-left">
              <h3>{this.state.league.name}</h3>
              <p>Ended on: {this.state.league.endDate}</p>
            </div>
            <div className="col-md-8 col-xs-12">
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Member</th>
                    <th scope="col">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {/* sort members by score of the completed league */}
                  {this.state.members
                    .sort((a, b) => {
                      return (
                        b.completedLeagues.find(
                          league => league.info === this.state.league._id
                        ).score -
                        a.completedLeagues.find(
                          league => league.info === this.state.league._id
                        ).score
                      );
                    })
                    .map((member, index) => {
                      return (
                        <tr
                          key={index}
                          className={
                            member._id === this.state.loggedInUser._id
                              ? "table-info"
                              : ""
                          }
                        >
                          <th scope="row">{index + 1}</th>
                          <td>{member.username}</td>
                          <td>
                            {
                              member.completedLeagues.find(
                                league => league.info === this.state.league._id
                              ).score
                            }
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Archive;
