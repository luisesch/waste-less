import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "./auth/auth-service";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedInUser: null };
    this.service = new AuthService();
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
    if (this.state.loggedInUser) {
      return (
        <nav className="navbar navbar-light bg-light justify-content-between navbar-fixed-top">
              <Link to="/" className="navbar-brand">Home</Link>
              <form className="form-inline">
              <Link to="/" className="navbar-brand">Dashboard</Link>
              <Link to="/league" className="navbar-brand">League</Link>
              <Link to="/profile" className="navbar-brand">Profile</Link>
              <button className="mx-2"> Score </button>
              <Link to="/" className="navbar-brand">
                <button onClick={() => this.logoutUser()}>Logout</button>
              </Link>
              </form>
        </nav>
      );
    } else {
      return (
        <nav className="navbar navbar-light bg-light justify-content-between navbar-fixed-top">
               <Link to="/" className="navbar-brand">Home</Link>
               <form className="form-inline">              
              <Link to="/" className="navbar-brand" style={{ textDecoration: "none" }}>
                Login
              </Link>
              <Link to="/signup" className="navbar-brand" style={{ textDecoration: "none" }}>
                Signup
              </Link>
              </form>
        </nav>
      );
    }
  }
}

export default Navbar;