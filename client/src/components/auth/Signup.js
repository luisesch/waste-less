import React, { Component } from "react";
import AuthService from "./auth-service";
import { Link } from "react-router-dom";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "", email: "", message: "" };
    this.service = new AuthService();
  }

  handleFormSubmit = event => {
    event.preventDefault();
    const username = this.state.username;
    const password = this.state.password;
    const email = this.state.email;
    this.props.signup(username, password, email);
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <div>
        <h3 className="fontForm">Signup</h3>
        <form onSubmit={this.handleFormSubmit} className="pt-3">
          <div className="form-group">
            <input
              type="text"
              name="username"
              value={this.state.username}
              onChange={e => this.handleChange(e)}
              className="form-control"
              placeholder="Username"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={this.state.email}
              onChange={e => this.handleChange(e)}
              className="form-control"
              placeholder="Email"
            />
            <small className="form-text text-muted">
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

          {/* <div className="form-group form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
            />
            <label className="form-check-label" htmlFor="exampleCheck1">
              I accept the terms of use and privacy statement{" "}
            </label>
          </div> */}

          <button type="submit" className="btn mt-3 Home-btn" value="Signup">
            Submit
          </button>
        </form>

        <div className="message">
          <p>{this.state.message}</p>
        </div>

        <p>
          Already have an account?
          <Link
            to={"/login"}
            style={{ textDecoration: "underline", color: "#1b2f33" }}
          >
            {" "}
            Login
          </Link>
        </p>
      </div>
    );
  }
}

export default Signup;
