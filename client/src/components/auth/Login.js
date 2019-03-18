import React, { Component } from "react";
import AuthService from "./auth-service";
import { Link } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "", message: "" };
    this.service = new AuthService();
  }

  handleFormSubmit = event => {
    event.preventDefault();
    const username = this.state.username;
    const password = this.state.password;

    this.props.login(username, password);
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <div>
        <h3 className="fontForm">Login with your account</h3>
        <form onSubmit={this.handleFormSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              value={this.state.username}
              onChange={e => this.handleChange(e)}
              className="form-control"
              aria-describedby="emailHelp"
              placeholder="Username"
            />
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

          <button type="submit" className="btn btn-primary" value="Login">
            Submit
          </button>
          <br />
          <br />
        </form>
        <p>
          Don't have an account yet? Sign up<Link to={"/"}> here</Link>
        </p>
      </div>
    );
  }
}

export default Login;
