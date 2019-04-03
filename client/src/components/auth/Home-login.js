import React, { Component } from "react";
import AuthService from "./auth-service";
// import { Link } from "react-router-dom";
// import { Switch, Route } from "react-router-dom";
import Login from "./Login";
import "./Home.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.service = new AuthService();
  }

  login = (username, password) => {
    this.service
      .login(username, password)
      .then(response => {
        this.props.getUser(response);
        this.props.history.push("/myleague");
      })
      .catch(error => console.log(error));
  };

  signup = (username, password) => {
    this.service
      .signup(username, password)
      .then(response => {
        if (response.message) {
          this.setState({ message: response.message });
        } else {
          this.setState({
            username: "",
            password: "",
            message: ""
          });
          this.props.getUser(response);
          this.props.history.push("/welcome");
        }
      })
      .catch(error => console.log(error));
  };

  render() {
    return (
      <div className="Home container-fluid">
        <div className="row">
          <div className="leftBar col-xs-12 col-md-8 pt-5">
            <h1 className="header">WASTE-LESS</h1>
            <h4 className="subheader">There is no plan(et) B</h4>
          </div>
          <div className="rightBar col-xs-12 col-md-4 p-5">
            <Login login={this.login} />
          </div>
        </div>
        <div className="about p-5">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and
          </p>
        </div>
      </div>
    );
  }
}

export default Home;
