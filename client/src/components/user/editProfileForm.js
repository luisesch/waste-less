import React, { Component } from "react";
import AuthService from "../auth/auth-service";
import TaskService from "../tasks/task-service";
import "./Profile.css";

import UserService from "./user-service";

class EditProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: {},
      username: "",
      password: "",
      passwordRepeat: "",
      motto: "",
      message: ""
    };
    this.authService = new AuthService();
    this.taskService = new TaskService();
    this.userService = new UserService();
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFormSubmitMotto = event => {
    event.preventDefault();
    const motto = this.state.motto;

    if (motto === "") {
      this.setState({ message: "Please enter your motto." });
    }

    this.props.handleFormSubmit("motto", motto);
  };

  handleFormSubmitPassword = event => {
    event.preventDefault();
    const password = this.state.password;
    const passwordRepeat = this.state.passwordRepeat;

    if (password !== passwordRepeat) {
      this.setState({ message: "Please repeat your new password." });
    } else if (password.length < 8) {
      this.setState({
        message:
          "Please make sure your passoword is at least 8 characters long."
      });
    } else {
      const password = this.state.password;
      this.props.handleFormSubmit("password", password);
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleFormSubmitPassword} className="row">
          <div className="form-group col-5">
            <input
              type="password"
              className="form-control"
              name="password"
              value={this.state.password}
              placeholder="Enter new password"
              onChange={e => this.handleChange(e)}
            />
          </div>
          <div className="form-group col-4">
            <input
              type="password"
              className="form-control"
              name="passwordRepeat"
              value={this.state.passwordRepeat}
              placeholder="Repeat new password"
              onChange={e => this.handleChange(e)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary col-3 h-25 "
            value="password"
          >
            Save
          </button>
        </form>
        <p>{this.state.message}</p>
        <form onSubmit={this.handleFormSubmitMotto} className="row">
          <div className="form-group col-9">
            <textarea
              className="form-control"
              name="motto"
              rows="3"
              value={this.state.motto}
              placeholder="Enter new motto"
              onChange={e => this.handleChange(e)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary col-3 h-25"
            value="motto"
          >
            Save
          </button>
        </form>
      </div>
    );
  }
}

export default EditProfileForm;
