import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "./auth/auth-service";
import "./Navbar.css";
import LeagueService from "./league/league-service";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedInUser: null };
    this.service = new AuthService();
    this.leagueService = new LeagueService();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...this.state, loggedInUser: nextProps["userInSession"] });
  }

  logoutUser = () => {
    this.service.logout().then(() => {
      this.setState({ loggedInUser: null });
      this.props.getUser(null);
    });
  };

  render() {
    //if user is logged in

    if (this.state.loggedInUser) {
      return (
        <nav className="navbar navbar-light bg-light navbar-fixed-top">
          <Link to="/myleague" className="navbar-brand">
            Home
          </Link>
          <form className="form-inline">
            <Link to="/tasks" className="navbar-brand">
              Tasks
            </Link>
            <Link to="/myleague" className="navbar-brand">
              My league
            </Link>
            <Link to="/profile" className="navbar-brand">
              Profile
            </Link>


            <button className="mx-2 btn btn-outline-success" type="button">
              Score {this.state.loggedInUser.score}
            </button> */}

            <button
              onClick={() => this.logoutUser()}
              type="button"
              className="btn btn-outline-dark"
            >
              Logout
            </button>
          </form>
        </nav>
      );
      // if user is not logged in
    } else {
      return (
        <nav className="navbar navbar-light bg-light justify-content-between navbar-fixed-top">
          <Link to="/" className="navbar-brand">
            Home
          </Link>
          <form className="form-inline">
            <Link
              to="/login"
              className="navbar-brand"
              style={{ textDecoration: "none" }}
            >
              Login
            </Link>
            <Link
              to="/"
              className="navbar-brand"
              style={{ textDecoration: "none" }}
            >
              Signup
            </Link>
          </form>
        </nav>
      );
    }
  }
}

export default Navbar;
