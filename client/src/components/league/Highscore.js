import React, { Component } from "react";
// import { Link } from "react-router-dom";
import LeagueService from "./league-service";
import Moment from "moment";
import DeleteMemberButton from "./DeleteMemberButton";
import DeleteLeagueButton from "./DeleteLeagueButton";
import UserSearch from "../user/UserSearch";
import UserService from "../user/user-service";

class ActiveLeague extends Component {
  constructor(props) {
    super(props);

    this.state = {
      league: {},
      loggedInUser: this.props.userInSession,
      members: [],
      endDate: "",
      edit: false,
      filteredUsers: [],
      users: null
    };
    this.leagueService = new LeagueService();
    this.userService = new UserService();
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

  changeEdit = () => {
    this.state.edit
      ? this.setState({ edit: false })
      : this.setState({ edit: true });
  };

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
          {/* show search bar for new members, if user is admin and edit is clicked */}
          {this.state.edit ? (
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
            </div>
          ) : null}
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
