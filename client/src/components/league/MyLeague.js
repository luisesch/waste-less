import React, { Component } from "react";
// import { Link } from "react-router-dom";
import LeagueService from "./league-service";
import UserService from "../user/user-service";
import UserSearch from "../user/UserSearch";
import AuthService from "../auth/auth-service";
import { Link } from "react-router-dom";

class MyLeague extends Component {
  constructor(props) {
    super(props);

    this.state = {
      league: {},
      members: [],
      selectedMember: [],
      filteredUsers: [],
      users: null,
      loggedInUser: null
    };
    this.leagueService = new LeagueService();
    this.userService = new UserService();
    this.authService = new AuthService();
  }

  componentDidMount() {
    // get logged in user and add to state
    this.authService
      .loggedin()
      .then(response => {
        this.setState({
          loggedInUser: response
        });
        // if user has no league
        if (!this.state.loggedInUser.league) {
          this.setState({ league: false });
          // if user has league
        } else {
          const leagueId = this.state.loggedInUser.league;
          //get current league
          this.leagueService
            .getLeague(leagueId)
            .then(response => this.setState({ league: response }));
          //get members of current league
          this.leagueService
            .getMembers(leagueId)
            .then(response => this.setState({ members: response }));
          //get all users
          this.userService.showAll().then(response => {
            this.setState({ users: response });
          });
        }
      })
      .catch(err => {});
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
    const res = await this.leagueService.addMember(leagueId, userId);
    await this.setState({ league: res });

    this.leagueService
      .getMembers(leagueId)
      .then(response => this.setState({ members: response }));
  };

  deleteMember = async event => {
    let leagueId = this.state.league._id;
    let memberId = event.target.value;
    const res = await this.leagueService.deleteMember(leagueId, memberId);
    await this.setState({ league: res });

    this.leagueService
      .getMembers(leagueId)
      .then(response => this.setState({ members: response }));
  };

  render() {
    if (!this.state.league) {
      return (
        <div>
          <p>You haven't created any leagues yet.</p>
          <Link to="/newleague">Create new league</Link>
        </div>
      );
    } else {
      return (
        <div>
          <h2>Your league</h2>
          <h3>Name</h3>
          <p>{this.state.league.name}</p>
          <h3>Members</h3>
          <ul>
            {this.state.members.map((member, index) => {
              return (
                <li key={index}>
                  {member.info.username} <br />
                  {member.info.confirmed ? "confirmed" : "waiting"}
                  <br />
                  <button
                    name="deleteMember"
                    type="submit"
                    value={member.info._id}
                    onClick={this.deleteMember}
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
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
                    className="btn"
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
        </div>
      );
    }
  }
}

export default MyLeague;
