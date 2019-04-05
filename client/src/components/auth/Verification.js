import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "../auth/auth-service";

class Verification extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedInUser: this.props.user };
    this.authService = new AuthService();
  }

  componentDidMount() {
    // get logged in user and add to state
    const code = this.props.match.params.confirmationCode;

    this.authService.loggedin().then(response => {
      this.authService
        .verify(response._id, code)
        .then(response => {
          this.setState({
            loggedInUser: response
          });
        })
        .catch(err => console.log(err))
        .catch(err => console.log(err));
    });
  }

  render() {
    if (!this.state.loggedInUser) {
      return <p>Loading...</p>;
    } else {
      return (
        <div className="mt-3">
          <div className="container">
            <div className="row noborder">
              <div className="col-md-7 col-xs-12 ">
                <img
                  className="img-fluid rounded mb-4"
                  src="http://trashisfortossers.com/wp-content/uploads/2017/10/beginners-guide-to-zero-waste-featured-image.jpg"
                  alt=""
                />
              </div>
              <div className="col-md-5 col-xs-12">
                <h1 className="font-weight-light Quicksand mb-5">
                  Thank you for verifying your email address,{" "}
                  {this.state.loggedInUser.username}
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
}

export default Verification;
