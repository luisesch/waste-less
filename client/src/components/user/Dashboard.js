import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import AuthService from "../auth/auth-service";

import "bootstrap/dist/css/bootstrap.css";
import "./Dashboard.css";

import LeagueService from "../league/league-service";
import Moment from "moment";
import TaskService from "../tasks/task-service";

class MyLeague extends Component {
  constructor(props) {
    super(props);
    this.state = {
      league: this.props.league,
      firstThree: [],
      completedTasks: []
    };
    this.authService = new AuthService();
    this.leagueService = new LeagueService();
    this.taskService = new TaskService();
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
      .getCompletedTasks(this.props.league._id)
      .then(response => {
        let tasks = [];
        response.forEach(completedTask => {
          tasks.push(completedTask.task);
        });
        this.setState({ completedTasks: tasks });
      })
      .catch(err => console.log(err));
  }

  render() {
    if (this.state.firstThree.length === 0) {
      return <p>Loading</p>;
    } else {
      return (
        <div>
          <div className="row align-items-center my-5">
            <div className="col-lg-7">
              <img
                className="img-fluid rounded mb-4 mb-lg-0"
                src={this.state.league.photo}
                alt=""
              />
            </div>
            <div className="col-lg-5">
              <h1 className="font-weight-light">
                Dashboard of {this.props.league.name}
              </h1>
              <br />
              <h5>-Best of the League-</h5>

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

          <p className="m-0">See the latest tasks of your team</p>
          <div className="row">
            {this.state.completedTasks.map((task, index) => {
              return (
                <div
                  key={index}
                  className="card col-xs-12 col-md-3 mb-5 mt-3 mx-3"
                >
                  <div className="card-body h-100">
                    <h5 className="card-title">Card title</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      xy got {task.points} points for:
                    </h6>
                    <p className="card-text">{task.description}</p>
                    <Link to="#" className="card-link">
                      Card link
                    </Link>
                    <Link to="#" className="card-link">
                      Another link
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* <div className="card col-xs-12 col-md-3 mb-5 mt-3 mx-3">
              <div className="card-body h-100">
                <h5 className="card-title">Card title</h5>
                <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <Link to="#" className="card-link">
                  Card link
                </Link>
                <Link to="#" className="card-link">
                  Another link
                </Link>
              </div>
            </div>

            <div className="card col-xs-12 col-md-3 mb-5 mt-3 mx-3">
              <div className="card-body h-100">
                <h5 className="card-title">Card title</h5>
                <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <Link to="#" className="card-link">
                  Card link
                </Link>
                <Link to="#" className="card-link">
                  Another link
                </Link>
              </div>
            </div> */}
          </div>
        </div>
      );
    }
  }
}

export default withRouter(MyLeague);
