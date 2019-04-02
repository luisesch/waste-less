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
        <nav className="navbar blue justify-content-between navbar-fixed-top">
          <Link to="/myleague" className="navbar-brand">
            <img src="/images/Schwarz_wasteless-02.png" alt="" />
          </Link>
          <form className="form-inline">
            <Link
              to="/tasks"
              className="navbar-brand"
              style={{ textDecoration: "none", color: "#1b2f33" }}
            >
              Tasks
            </Link>
            <Link
              to="/myleague"
              className="navbar-brand"
              style={{ textDecoration: "none", color: "#1b2f33" }}
            >
              My league
            </Link>
            <Link
              to="/profile"
              className="navbar-brand"
              style={{ textDecoration: "none", color: "#1b2f33" }}
            >
              Profile
            </Link>
            <button
              onClick={() => this.logoutUser()}
              type="button"
              className="btn Navbar-btn p-2"
            >
              Logout
            </button>
          </form>
        </nav>
      );
      // if user is not logged in
    } else {
      return (
        <nav className="navbar blue justify-content-between navbar-fixed-top">
          <Link to="/" className="navbar-brand">
            <img src="/images/Schwarz_wasteless-02.png" alt="" />
          </Link>
          <form className="form-inline">
            <Link
              to="/login"
              className="navbar-brand"
              style={{ textDecoration: "none", color: "#1b2f33" }}
            >
              Login
            </Link>
            <Link
              to="/"
              className="navbar-brand"
              style={{ textDecoration: "none", color: "#1b2f33" }}
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
