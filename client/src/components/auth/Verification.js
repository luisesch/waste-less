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
          console.log(response);
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
      return <p>Loading</p>;
    } else {
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <img
                className="img-fluid rounded mb-4 mb-lg-0"
                src="http://trashisfortossers.com/wp-content/uploads/2017/10/beginners-guide-to-zero-waste-featured-image.jpg"
                alt=""
              />
            </div>
            <div className="col-md-5 right">
              <h1 className="card-title font-weight-light">
                Thank you for verifying your email address,{" "}
                {this.state.loggedInUser.username}
              </h1>
              <br />
              <Link to={"/myleague"}>Check out your dashboard</Link>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Verification;
