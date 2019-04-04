import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "../auth/auth-service";

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedInUser: {} };
    this.authService = new AuthService();
  }

  componentDidMount() {
    // get logged in user and add to state
    this.authService
      .loggedin()
      .then(response => {
        this.setState({
          loggedInUser: response
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="card">
        <div className="createLeague card-body">
          <div className="row">
            <div className="col-md-7 left">
              <img
                className="img-fluid rounded mb-4 mb-lg-0"
                src="http://trashisfortossers.com/wp-content/uploads/2017/10/beginners-guide-to-zero-waste-featured-image.jpg"
                alt=""
              />
            </div>
            <div className="col-md-5 right">
              <h1 className="card-title font-weight-light">
                Thank you for signing up, {this.state.loggedInUser.username}
              </h1>
              <br />
              <Link
                to={"/"}
                style={{ textDecoration: "underline", color: "#1b2f33" }}
              >
                Check out your dashboard
              </Link>
            </div>
          </div>
        </div>
        <div className="card-footer text-muted"> There is no planet B </div>
      </div>
    );
  }
}

export default Welcome;
