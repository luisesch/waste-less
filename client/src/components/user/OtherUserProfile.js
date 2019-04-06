import React, { Component } from "react";

import "./Profile.css";
import Moment from "moment";

import UserService from "./user-service";
import TaskService from "../tasks/task-service";

class OtherUserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      completedTasks: null
    };
    this.userService = new UserService();
    this.taskService = new TaskService();
  }

  componentDidMount = () => {
    let newState = {};
    this.userService
      .getOneUser(this.props.match.params.id)
      .then(res => {
        newState.user = res;
        return this.taskService.getCompletedTasksUser(res._id);
      })
      .then(response => {
        let tasks = [];
        response.forEach(completedTask => {
          tasks.push(completedTask);
        });
        tasks.reverse();
        newState.completedTasks = tasks;
        this.setState(newState);
      })
      .catch(err => console.log(err));
  };

  render() {
    if (!this.state.user) {
      return <p>Loading...</p>;
    } else {
      return (
        <div className="profile px-5 pb-5 pt-1 mt-5">
          <h1 className="font-weight-light Quicksand">
            Welcome to {this.state.user.username}'s profile
          </h1>
          <hr className="w-75" />
          <h4 className="mb-5 mx-2">Thank you for stopping by</h4>

          <div className="container">
            <div className="row noborder">
              <div className="col-md-6 col-xs-12">
                <img
                  className="img-fluid rounded-circle profile-pic"
                  src={this.state.user.photo}
                  alt="default"
                />
              </div>

              <div className="col-md-6 col-xs-12 mt-0">
                <p className="mt-3">Motto: "{this.state.user.motto}"</p>
                <hr />
                {this.state.user.league.confirmed ? (
                  <p>
                    Currently part of the league {this.state.user.league.name}
                  </p>
                ) : (
                  <p>Not currently part of any league.</p>
                )}

                <hr />
                <p>
                  Current Score:{" "}
                  <strong className="score px-2">
                    {this.state.user.score}
                  </strong>
                </p>
              </div>
            </div>
          </div>

          <div className="container white-top mt-5">
            <h4>Latest completed tasks</h4>
            <div className="row noborder mt-3">
              {this.state.completedTasks.length <= 0 ? (
                <p className="notasks">
                  {this.state.user.username} hasn't completed any tasks yet.
                </p>
              ) : (
                this.state.completedTasks.map((task, index) => {
                  if (index <= 2) {
                    return (
                      <div key={index} className="col-md-4 col-xs-12 mt-4">
                        <div className="card" key={index}>
                          <div className="card-body font-weight-light">
                            <img
                              src={task.task.photo}
                              className="card-img-top img-thumbnail"
                              alt="default"
                            />
                            <p className="card-title">
                              <br />
                              <strong>{task.task.points}</strong> points for
                              task:
                              <br />
                              {task.task.description}
                              <br />
                              <br />
                              <small>
                                {Moment(task.created_at)
                                  .startOf("minute")
                                  .fromNow()}
                              </small>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })
              )}
            </div>
          </div>
        </div>
      );
    }
  }
}

export default OtherUserProfile;
