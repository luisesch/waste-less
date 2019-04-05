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
      <div className="mt-3">
        <div className="container">
          <div className="row noborder">
            <div className="col-md-7 col-xs-12 left">
              <img
                className="img-fluid rounded"
                src="/images/welcome_page.jpg"
                alt=""
              />
            </div>
            <div className="col-md-5 col-xs-12 right">
              <h1 className="font-weight-light Quicksand mb-5">
                Thank you for signing up, {this.state.loggedInUser.username}
              </h1>

              <Link
                to={"/profile"}
                style={{ textDecoration: "underline", color: "#1b2f33" }}
              >
                Check out your profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Welcome;
