import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "../auth/auth-service";
import TaskService from "../tasks/task-service";
import "bootstrap/dist/css/bootstrap.css";
import "./Profile.css";
import api from "../../api";
import Moment from "moment";
import UserService from "./user-service";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: {},
      file: null,
      completedTasks: []
    };
    this.authService = new AuthService();
    this.taskService = new TaskService();
    this.userService = new UserService();
  }

  handleChange(e) {
    this.setState({
      file: e.target.files[0]
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.userService
      .addPicture(this.state.file, this.state.loggedInUser._id)
      .then(res => this.setState({ loggedInUser: res }));
  }

  componentDidMount() {
    // get logged in user and add to state
    this.authService
      .loggedin()
      .then(response => {
        this.setState({
          loggedInUser: response
        });
        this.taskService
          .getCompletedTasksUser(response._id)
          .then(response => {
            let tasks = [];
            response.forEach(completedTask => {
              tasks.push(completedTask);
            });
            tasks.reverse();
            this.setState({ completedTasks: tasks });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="profileContainer container">
        <div className="row">
          <div className="col-md-8">
            <h3 className="my-4">
              Welcome to your profile, {this.state.loggedInUser.username}
              <br />
              <small>Have you been waste-less today?</small>
            </h3>

            <div className="card mb-4">
              <img
                className="card-img-top"
                src={this.state.loggedInUser.photo}
                alt="default"
              />

              <form onSubmit={e => this.handleSubmit(e)}>
                <input type="file" onChange={e => this.handleChange(e)} />{" "}
                <br />
                <button type="submit">Save new profile picture</button>
              </form>

              <div className="card-body">
                {/* <h2 className="card-title">Post Title</h2> */}
                <div className="card-text">
                  {" "}
                  <h4>Motto:</h4> "Es gibt viel, was du selbst tun kannst."
                </div>
                <Link to="#" className="btn btn-primary">
                  Edit Profile
                </Link>
              </div>
              <div className="card-footer text-muted">
                Currently part of the league{" "}
                <Link to="/" className="card-link">
                  Dashboard
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <br />
            <h5 className="font-weight-bold text-right pr-3">
              Score {this.state.loggedInUser.score}
            </h5>

            <div className="card my-4">
              <h5 className="card-header">Invitation</h5>
              <div className="card-body">
                You are invited to join the league "..."
                <span className="input-group-btn">
                  <button className="mx-2 btn btn-secondary" type="button">
                    Confirm
                  </button>
                </span>
              </div>
            </div>

            <div className="card my-4">
              <h5 className="card-header">Search for new tasks</h5>
              <div className="card-body">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for..."
                  />
                  <span className="input-group-btn">
                    <button className="btn btn-secondary" type="button">
                      Go!
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3>Latest completed tasks</h3>
        <div className="row">
          {this.state.completedTasks.length <= 0 ? (
            <p>
              No completed tasks yet. Get started!
              <br />
              <Link to="/tasks">Browse tasks</Link>
            </p>
          ) : (
            this.state.completedTasks.map((task, index) => {
              // decide how many tasks are displayed via index
              if (index <= 2) {
                return (
                  <div
                    className="card text-center col-xs-12 col-lg-3 mb-5 mt-3"
                    key={index}
                  >
                    <div className="card-body font-weight-light">
                      <h5 className="card-title">
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
            })
          )}
        </div>
      </div>
    );
  }
}

export default Profile;
