import React, { Component } from "react";
import AuthService from "./auth-service";
import { Link } from "react-router-dom";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "", message: "" };
    this.service = new AuthService();
  }

  handleFormSubmit = event => {
    event.preventDefault();
    const username = this.state.username;
    const password = this.state.password;
    this.props.signup(username, password);
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <div>
        <h3 className="fontForm">Signup</h3>
        <form onSubmit={this.handleFormSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              value={this.state.username}
              onChange={e => this.handleChange(e)}
              className="form-control"
              placeholder="Username"
            />

            <small id="emailHelp" className="form-text text-muted">
              We'll never share your email with anyone.
            </small>
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control"
              name="password"
              value={this.state.password}
              onChange={e => this.handleChange(e)}
              placeholder="Password"
            />
          </div>

          <button type="submit" className="btn btn-primary" value="Signup">
            Submit
          </button>
        </form>

        <div className="message">
          <p>{this.state.message}</p>
        </div>

        <p>
          Already have an account?
          <Link to={"/"}> Login</Link>
        </p>
      </div>
    );
  }
}

export default Signup;
