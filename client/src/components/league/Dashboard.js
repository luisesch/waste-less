import React, { Component } from "react";
import { withRouter } from "react-router";

import AuthService from "../auth/auth-service";

import "./Dashboard.css";

import LeagueService from "./league-service";
import Moment from "moment";
import TaskService from "../tasks/task-service";
import DeleteMemberButton from "./DeleteMemberButton";
import UserService from "../user/user-service";
import Carouseltasks from "./Carousel";
import Highscore from "./Highscore";
import DeleteLeagueButton from "./DeleteLeagueButton";
import UserSearch from "../user/UserSearch";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      league: this.props.league,
      firstThree: [],
      completedTasks: [],
      editPicture: false,
      highscore: "short",
      members: [],
      filteredUsers: [],
      users: null,
      edit: false
    };
    this.authService = new AuthService();
    this.leagueService = new LeagueService();
    this.taskService = new TaskService();
    this.userService = new UserService();
  }

  componentDidMount() {
    this.leagueService
      .getMembers(this.props.league._id)
      .then(response => {
        let sortedMembers = [...response];
        sortedMembers.sort((a, b) => b.score - a.score);
        this.setState({ members: sortedMembers });
      })
      .catch(err => console.log(err));

    this.taskService
      .getCompletedTasksLeague(this.props.league._id)
      .then(response => {
        let tasks = [];
        response.forEach(completedTask => {
          tasks.push(completedTask);
        });
        tasks.reverse();
        this.setState({ completedTasks: tasks });
      })
      .catch(err => console.log(err));

    this.userService
      .showAll()
      .then(response => {
        for (var i = response.length - 1; i <= 0; i--) {
          if (response[i].username === this.props.userInSession.username) {
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

  editPicture = () => {
    this.state.editPicture
      ? this.setState({ editPicture: false })
      : this.setState({ editPicture: true });
  };

  handleChange(e) {
    this.setState({
      file: e.target.files[0]
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.leagueService
      .addLeaguePicture(this.state.file, this.props.league._id)
      .then(res => this.setState({ league: res }));
  }

  changeHighscore = () => {
    this.state.highscore === "short"
      ? this.setState({ highscore: "long" })
      : this.setState({ highscore: "short" });
  };

  changeEdit = () => {
    this.state.edit
      ? this.setState({ edit: false })
      : this.setState({ edit: true });
  };

  render() {
    if (this.state.members.length === 0) {
      return <p>Loading...</p>;
    } else {
      return (
        <div className="Dashboard p-5">
          <h1 className="font-weight-light Quicksand">
            Dashboard of league "{this.props.league.name}"
          </h1>
          <hr className="w-75" />
          <h4 className="mb-5">
            Your league ends {Moment(this.props.endDate, "L").fromNow()},{" "}
            {this.props.userInSession.username}
          </h4>
          <div className="container">
            <div className="row">
              {/* league's profile picture */}
              <div className="col-md-6 col-xs-12 p-0 mb-3">
                <span>
                  <h4 className="text-center mb-3">
                    Your current Score:{" "}
                    <strong className="score px-2">
                      {this.props.userInSession.score}
                    </strong>
                  </h4>
                </span>

                <img
                  className="img-fluid rounded mb-1"
                  src={this.state.league.photo}
                  alt=""
                />
                <div className="overlaybase text-left mx-2">
                  {this.props.userInSession._id ===
                    this.state.league.administrator._id && (
                    <button
                      className="btn btn-light"
                      onClick={this.editPicture}
                    >
                      Change picture
                    </button>
                  )}
                  {this.state.editPicture ? (
                    <form
                      className="overlay"
                      onSubmit={e => this.handleSubmit(e)}
                    >
                      <input type="file" onChange={e => this.handleChange(e)} />{" "}
                      <br />
                      <button type="submit" className="btn-light">
                        Save new league picture
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>
              <div className="col-md-6 col-xs-12 p-0 mb-3">
                <h4 className="text-center mb-3">Latest league activities</h4>
                <Carouseltasks tasks={this.state.completedTasks} />
              </div>
            </div>
          </div>

          <div className="highscore text-center">
            <Highscore
              members={this.state.members}
              userInSession={this.props.userInSession}
              status={this.state.highscore}
              edit={this.state.edit}
            />

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

            {this.state.highscore === "short" ? (
              <button
                className="btn btn-light mt-2"
                onClick={this.changeHighscore}
              >
                See all
              </button>
            ) : (
              <button
                className="btn btn-light mt-2"
                onClick={this.changeHighscore}
              >
                See less
              </button>
            )}
          </div>

          <div className="row noborder mt-5">
            <div className="col-3">
              {" "}
              {this.props.userInSession._id !==
                this.state.league.administrator._id && (
                <DeleteMemberButton user={this.props.userInSession}>
                  Leave league
                </DeleteMemberButton>
              )}
            </div>
            <div className="col-6" />
          </div>

          {this.props.userInSession._id ===
          this.state.league.administrator._id ? (
            <div className="text-right">
              <button
                className={
                  this.state.edit ? "btn Home-btn mx-2" : "btn btn-light mx-2"
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
        </div>
      );
    }
  }
}

export default withRouter(Dashboard);
