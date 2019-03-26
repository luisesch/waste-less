import React, { Component } from "react";
import { withRouter } from "react-router";

import UserSearch from "../user/UserSearch";
import "bootstrap/dist/css/bootstrap.css";
import LeagueService from "../league/league-service";
import UserService from "../user/user-service";
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

    this.userService
      .showAll()
      .then(response => {
        this.setState({ users: response });
      })
      .catch(err => console.log(err));
  }

  searchUserHandler = query => {
    if (query.length < 1) {
      this.setState({ filteredUsers: [] });
    } else {
      let filteredUsers = this.state.users.filter(user => {
        const userLowerCase = user.username.toLowerCase();
        const filter = query;
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
  };

  deleteMember = async event => {
    let leagueId = this.state.league._id;
    let memberId = event.target.value;
    await this.leagueService.deleteMember(leagueId, memberId);

    this.leagueService
      .getMembers(leagueId)
      .then(response => this.setState({ members: response }))
      .catch(err => console.log(err));
  };

  startLeague = async () => {
    const leagueId = this.state.league._id;
    await this.leagueService.startLeague(this.state.league._id);

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
      return <p>Loading</p>;
    } else {
      return (
        <div>
          <h2>Your league</h2>
          <h3>Name</h3>
          <p>{this.state.league.name}</p>

          <h3>Members</h3>
          {/* show delete button and status of members, only if loggedin user s administrator */}
          {this.state.league.administrator._id ===
          this.state.loggedInUser._id ? (
            <ul>
              <li>
                Admin:
                {this.state.league.administrator.username}
              </li>

              {this.state.members.map((member, index) => {
                return (
                  <li key={index}>
                    {member.username} <br />
                    {member.league.confirmed ? "confirmed" : "waiting"}
                    <br />
                    <button
                      name="deleteMember"
                      type="submit"
                      value={member._id}
                      onClick={this.deleteMember}
                    >
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            // if loggedin user is not administrator, only show member names
            <ul>
              <li>
                Admin:
                {this.state.league.administrator.username}
              </li>

              {this.state.members.map((member, index) => {
                return <li key={index}>{member.username}</li>;
              })}
            </ul>
          )}

          {/* only show add option, if loggedin user is administrator */}
          {this.state.league.administrator._id ===
          this.state.loggedInUser._id ? (
            <div>
              <p>
                <strong>Add members</strong>
              </p>
              <UserSearch searchUsers={this.searchUserHandler} />
              <ul>
                {this.state.filteredUsers.map((user, index) => {
                  // turn object into string
                  return (
                    <li key={index}>
                      {user.username}
                      <button
                        className="btn btn-primary"
                        htmlFor="user"
                        value={user._id}
                        onClick={this.addUser}
                      >
                        Add
                      </button>
                    </li>
                  );
                })}
              </ul>
              {/* check, if all members have confirmed */}
              {this.state.members.every(member => {
                return member.league.confirmed === true;
              }) ? (
                <button onClick={this.startLeague} className="btn btn-primary">
                  Let the games begin
                </button>
              ) : (
                <button className="btn btn-primary">
                  Waiting for all members to confirm
                </button>
              )}
            </div>
          ) : null}
        </div>
      );
    }
  }
}

export default withRouter(WaitingLeague);
