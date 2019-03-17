import React, { Component } from "react";
import AuthService from "./auth-service";
import { Link } from "react-router-dom";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "", message: "" };
    this.service = new AuthService();
  }

  handleFormSubmit = event => {
    event.preventDefault();
    const username = this.state.username;
    const password = this.state.password;

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

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      //       <div className="SigningUp">
      //       <br/>
      //       <br/>
      //       <h3>Signup</h3>
      //       <form onSubmit={this.handleFormSubmit}>

      //   <div className="form-group">
      //     {/* <label for="exampleInputEmail1">Email address</label> */}
      //     <input
      //     type="text"
      //     className="form-control"
      //     value={this.state.username}
      //     onChange={e => this.handleChange(e)}
      //     // id="exampleInputEmail1"
      //     // aria-describedby="emailHelp"
      //     placeholder="Username"/>
      //     <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
      //   </div>

      //   <div className="form-group">
      //     {/* <label for="exampleInputPassword1">Password</label> */}
      //     <input
      //     type="password"
      //     className="form-control"
      //     value={this.state.password}
      //     onChange={e => this.handleChange(e)}
      //     // id="exampleInputPassword1"
      //     placeholder="Password"/>
      //   </div>

      //   <div className="form-group form-check">
      //     <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
      //     <label className="form-check-label" htmlFor="exampleCheck1">	I accept the terms of use and privacy statement{' '}</label>
      //   </div>
      //   <button type="submit" className="btn btn-primary" value="Signup">Submit</button>
      //   <p>
      //           Already have an account?
      //           <Link to={"/"}> Login</Link>
      //         </p>
      //   </form>
      // </div>

      <div>
        <form onSubmit={this.handleFormSubmit}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={e => this.handleChange(e)}
          />

          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={e => this.handleChange(e)}
          />

          <input type="submit" value="Signup" />
        </form>

        <div className="message">
          <p>{this.state.message}</p>
        </div>

        <p>
          Already have an account?
          <Link to={"/"}> Login</Link>
        </p>
      </div>
    );
  }
}

export default Signup;
