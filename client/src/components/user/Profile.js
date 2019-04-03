import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "../auth/auth-service";
import TaskService from "../tasks/task-service";
import "./Profile.css";
import Moment from "moment";
import UserService from "./user-service";
import EditProfileForm from "./editProfileForm";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: {},
      file: null,
      completedTasks: [],
      edit: false,
      editPicture: false
    };
    this.authService = new AuthService();
    this.taskService = new TaskService();
    this.userService = new UserService();
  }

  changeEdit = () => {
    this.state.edit
      ? this.setState({ edit: false })
      : this.setState({ edit: true });
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
    this.userService
      .addPicture(this.state.file, this.state.loggedInUser._id)
      .then(res => this.setState({ loggedInUser: res }));
  }

  handleFormSubmit = (attribute, value) => {
    this.userService
      .editProfile(this.state.loggedInUser._id, attribute, value)
      .then(res => {
        this.setState({ loggedInUser: res, edit: true });
      });
  };

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
      <div className="profile px-5 pb-5 pt-1">
        <div className="text-right">
          <button
            className={
              this.state.edit
                ? "btn btn-primary overlaybase"
                : "btn btn-light overlaybase"
            }
            onClick={this.changeEdit}
          >
            {this.state.edit ? "Done" : "Edit"}
          </button>
          {this.state.edit && (
            <EditProfileForm
              userInSession={this.state.loggedInUser}
              handleFormSubmit={this.handleFormSubmit}
            />
          )}
        </div>
        <h1 className="font-weight-light Quicksand">
          Welcome to your profile, {this.state.loggedInUser.username}
        </h1>
        <hr className="w-75" />
        <h4 className="mb-5 mx-2">Have you been waste-less today?</h4>

        <div className="container-fluid">
          <div className="row noborder">
            <div className="col-md-6 col-xs-12">
              <img
                className="img-fluid profilePhoto"
                src={this.state.loggedInUser.photo}
                alt="default"
              />
              <div className="overlaybase text-left mx-2">
                {this.state.edit && (
                  <button className="btn btn-light" onClick={this.editPicture}>
                    Change picture
                  </button>
                )}
                {this.state.edit && this.state.editPicture ? (
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

            <div className="col-md-6 col-xs-12 mt-0">
              <p className="mt-3">"{this.state.loggedInUser.motto}"</p>
              <hr />
              <p>
                Currently part of the league{" "}
                <Link to="/myleague" className="card-link">
                  Dashboard
                </Link>
              </p>
              <hr />
              <p>
                Your current Score:{" "}
                <strong className="score">
                  {this.state.loggedInUser.score}
                </strong>
              </p>
            </div>
          </div>
        </div>

        <div className="container-fluid white-top mt-5">
          <h4>Latest completed tasks</h4>
          <div className="row noborder mt-3">
            {this.state.completedTasks.length <= 0 ? (
              <p>
                No completed tasks yet. Get started!
                <br />
                <Link to="/tasks">Browse tasks</Link>
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
                            <strong>{task.user.username}</strong> collected{" "}
                            <br />
                            <strong>{task.task.points}</strong> points for task:
                            <br />
                            {task.task.description}
                            <small>
                              {Moment(task.created_at)
                                .startOf("hour")
                                .fromNow()}
                            </small>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
              })
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
