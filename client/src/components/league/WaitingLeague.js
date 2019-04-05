import React, { Component } from "react";
import { withRouter } from "react-router";

import UserSearch from "../user/UserSearch";
import LeagueService from "../league/league-service";
import UserService from "../user/user-service";
import "./WaitingLeague.css";
import DeleteMemberButton from "./DeleteMemberButton";

// import Moment from "moment";

class WaitingLeague extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: this.props.userInSession,
      league: this.props.league,
      filteredUsers: [],
      users: null,
      selectedMember: [],
      members: []
    };

    this.leagueService = new LeagueService();
    this.userService = new UserService();
  }

  componentDidMount() {
    this.leagueService
      .getMembers(this.state.loggedInUser.league.info)
      .then(response => this.setState({ members: response }))
      .catch(err => console.log(err));

    // get all users except the loggedin, so they can't select themselves
    this.userService
      .showAll()
      .then(response => {
        for (var i = response.length - 1; i >= 0; i--) {
          if (response[i].username === this.state.loggedInUser.username) {
            response.splice(i, 1);
          }
        }
        this.setState({ users: response });
      })
      .catch(err => console.log(err));
  }

  searchUserHandler = query => {
    if (query.length < 1) {
      this.setState({ filteredUsers: [] });
    } else {
      // only show users that aren't currently in any league
      let leaguelessUsers = this.state.users.filter(user => {
        return !user.league.hasOwnProperty("info");
      });

      let filteredUsers = leaguelessUsers.filter(user => {
        const userLowerCase = user.username.toLowerCase();
        const filter = query.toLowerCase();
        return userLowerCase.includes(filter);
      });
      this.setState({ filteredUsers: filteredUsers });
    }
  };

  addUser = async event => {
    const userId = event.target.value;
    const leagueId = this.state.league._id;
    await this.leagueService.addMember(leagueId, userId);

    this.leagueService
      .getMembers(leagueId)
      .then(response => this.setState({ members: response }))
      .catch(err => console.log(err));

    // get all users again to see changes
    this.userService
      .showAll()
      .then(response => {
        for (var i = response.length - 1; i >= 0; i--) {
          if (response[i].username === this.state.loggedInUser.username) {
            response.splice(i, 1);
          }
        }
        this.setState({ users: response, filteredUsers: [] });
      })
      .catch(err => console.log(err));
  };

  deleteMember = async event => {
    let leagueId = this.state.league._id;
    let memberId = event.target.value;
    await this.leagueService.deleteMember(leagueId, memberId);

    this.leagueService
      .getMembers(leagueId)
      .then(response => this.setState({ members: response }))
      .catch(err => console.log(err));

    // get all users again to see changes
    this.userService
      .showAll()
      .then(response => {
        for (var i = response.length - 1; i >= 0; i--) {
          if (response[i].username === this.state.loggedInUser.username) {
            response.splice(i, 1);
          }
        }
        this.setState({ users: response, filteredUsers: [] });
      })
      .catch(err => console.log(err));
  };

  startLeague = async () => {
    const leagueId = this.state.league._id;
    const duration = this.state.league.duration;
    await this.leagueService.startLeague(this.state.league._id, duration);

    this.leagueService
      .getLeague(leagueId)
      .then(response => {
        this.setState({ league: response });
        this.props.history.push("/myleague");
      })
      .catch(err => console.log(err));
  };

  render() {
    if (Object.entries(this.state.league).length === 0) {
      return <p>Loading...</p>;
    } else {
      return (
        <div className="mt-3">
          <div className="container px-5">
            <div className="row noborder">
              <div className="col-md-5 col-xs-12">
                <h2 className="font-weight-light Quicksand mb-5">
                  Your league
                </h2>
                <h3 className="text-left">Name: {this.state.league.name}</h3>
                <h3 className="text-left">Members:</h3>
                {/* show delete button and status of members, only if loggedin user s administrator */}
                {this.state.league.administrator._id ===
                this.state.loggedInUser._id ? (
                  <div className="table-responsive">
                    <table className="table">
                      <tbody>
                        {this.state.members.map((member, index) => {
                          return (
                            <tr key={index}>
                              <th scope="row">
                                <img
                                  className="Waiting-profilePic rounded"
                                  src={member.photo}
                                  alt="default"
                                />
                              </th>
                              <td>{member.username}</td>
                              <td>
                                {member._id ===
                                this.state.league.administrator._id
                                  ? "admin"
                                  : member.league.confirmed
                                  ? "confirmed"
                                  : "waiting"}
                              </td>
                              <td>
                                {/* make sure admin can't delete himself */}
                                {member._id !== this.state.loggedInUser._id && (
                                  <DeleteMemberButton user={member}>
                                    Delete
                                  </DeleteMemberButton>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  // if loggedin user is not administrator, only show member names
                  <div>
                    {this.state.members.map((member, index) => {
                      return (
                        <div key={index} className="text-left">
                          {member.username}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* only show add option, if loggedin user is administrator */}
                {this.state.league.administrator._id ===
                this.state.loggedInUser._id ? (
                  <div>
                    <UserSearch searchUsers={this.searchUserHandler} />
                    {this.state.filteredUsers.map((user, index) => {
                      // turn object into string
                      return (
                        <div key={index}>
                          <button
                            className="btn btn-light w-100"
                            htmlFor="user"
                            value={user._id}
                            onClick={this.addUser}
                          >
                            {user.username}
                          </button>
                          <br />
                        </div>
                      );
                    })}

                    {/* check, if all members have confirmed */}
                    {this.state.members.every(member => {
                      return member.league.confirmed === true;
                    }) ? (
                      <button
                        onClick={this.startLeague}
                        className="btn Home-btn mt-3 mb-3"
                      >
                        Let the games begin
                      </button>
                    ) : (
                      <button className="btn btn-light mt-3 mb-3">
                        Waiting for all members to confirm
                      </button>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="col-md-7 col-xs-12">
                <img
                  className="img-fluid rounded"
                  src="https://consciousbychloe.imgix.net/2018/06/consciousbychloe-5-Rs-zero-waste-ashley-hardy-vase-1.jpg"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withRouter(WaitingLeague);
