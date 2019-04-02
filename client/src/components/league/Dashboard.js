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
import ShortHighscore from "./ShortHighscore";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      league: this.props.league,
      firstThree: [],
      completedTasks: [],
      editPicture: false,
      highscore: "short"
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
        let firstThree = [];
        sortedMembers.sort((a, b) => b.score - a.score);
        firstThree = sortedMembers.slice(0, 2);
        this.setState({ firstThree: firstThree });
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
  }

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

  render() {
    if (this.state.firstThree.length === 0) {
      return <p>Loading</p>;
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
          <div className="container-fluid">
            <div className="row noborder">
              {/* league's profile picture */}
              <div className="col-md-6 col-xs-12 p-0 mb-3">
                <span>
                  <h4 className="text-center mb-3">
                    Your current Score:{" "}
                    <strong className="score">
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
                      <button type="submit">Save new profile picture</button>
                    </form>
                  ) : null}
                </div>
              </div>
              <div className="col-md-6 col-xs-12 p-0">
                <h4 className="text-center mb-3">Latest league activities</h4>
                <Carouseltasks tasks={this.state.completedTasks} />
              </div>
            </div>
          </div>

          <div className="highscore text-center white-top">
            {this.state.highscore === "short" && (
              <ShortHighscore
                firstThree={this.state.firstThree}
                userInSession={this.props.userInSession}
              />
            )}

            <button
              className="btn Dashboard-btn"
              onClick={this.changeHighscore}
            >
              See all
            </button>
          </div>

          <div className="row noborder">
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
        </div>
      );
    }
  }
}

export default withRouter(Dashboard);
