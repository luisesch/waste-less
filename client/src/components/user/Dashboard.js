import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import AuthService from "../auth/auth-service";

import "./Dashboard.css";

import LeagueService from "../league/league-service";
import Moment from "moment";
import TaskService from "../tasks/task-service";
import DeleteMemberButton from "../league/DeleteMemberButton";
import UserService from "./user-service";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      league: this.props.league,
      firstThree: [],
      completedTasks: [],
      editPicture: false
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

  render() {
    console.log(
      this.props.userInSession._id,
      this.state.league.administrator._id
    );
    if (this.state.firstThree.length === 0) {
      return <p>Loading</p>;
    } else {
      return (
        <div className="container">
          <div className="row">
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
            <div className="col-3">
              <h5 className="font-weight-bold text-right pr-3">
                Score {this.props.userInSession.score}
              </h5>
            </div>
          </div>
          <div className="row align-items-center my-5">
            <div className="col-lg-7 col-xs-12">
              <img
                className="img-fluid rounded mb-4 mb-lg-0"
                src={this.state.league.photo}
                alt=""
              />
              <div className="text-left">
                {this.props.userInSession._id ===
                  this.state.league.administrator._id && (
                  <button className="btn btn-light" onClick={this.editPicture}>
                    Change picture
                  </button>
                )}
                {this.state.editPicture ? (
                  <form onSubmit={e => this.handleSubmit(e)}>
                    <input type="file" onChange={e => this.handleChange(e)} />{" "}
                    <br />
                    <button type="submit">Save new profile picture</button>
                  </form>
                ) : null}
              </div>
            </div>
            <div className="col-lg-5 col-xs-12 px-0">
              <h1 className="font-weight-light">
                <br />
                Dashboard of {this.props.league.name}
              </h1>
              <br />
              <h5>-Top 3-</h5>

              <div className="rightBox">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.firstThree.map((member, index) => {
                      return (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{member.username}</td>
                          <td>{member.score}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <th />
                      <td>
                        <Link to="/myleague/highscore">See all</Link>
                      </td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="middleBlock card text-white my-5 py-4 text-center">
            <div className="card-body">
              <div className="text m-0">
                <h3>
                  Your league ends {Moment(this.props.endDate, "L").fromNow()},{" "}
                  {this.props.userInSession.username}
                </h3>
                <h5>What else can you do to rise your score today?</h5>
                <Link to="/tasks">Browse tasks</Link>
              </div>
            </div>
          </div>
          <br />

          <h2 className="m-0">See the latest tasks of your team</h2>
          {this.state.completedTasks.length <= 0 ? (
            <p>
              No completed tasks yet. Get started!
              <br />
              <Link to="/tasks">Browse tasks</Link>
            </p>
          ) : (
            <div className="row">
              {this.state.completedTasks.map((task, index) => {
                // decide how many tasks are displayed via index
                if (index <= 2) {
                  return (
                    <div
                      className="card text-center col-xs-12 col-lg-3 mb-5 mt-3"
                      key={index}
                    >
                      <div className="card-body font-weight-light">
                        <h5 className="card-title">
                          <strong>{task.user.username}</strong> collected <br />
                          <strong>{task.task.points}</strong> points for task:
                          <br />
                          {task.task.description}
                        </h5>
                        <img
                          src={task.task.photo}
                          className="card-img-top img-thumbnail"
                          alt="default"
                        />
                      </div>
                      <div className="card-footer text-muted">
                        <small>
                          {Moment(task.created_at)
                            .startOf("hour")
                            .fromNow()}
                        </small>
                      </div>
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          )}
        </div>
      );
    }
  }
}

export default withRouter(Dashboard);
