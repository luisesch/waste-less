import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "../auth/auth-service";
import 'bootstrap/dist/css/bootstrap.css';
import './Profile.css';
// import 'cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'


class Profile extends Component {
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
      <div className="profileContainer">

 <div className="row">

<div className="col-md-8">

  <h3 className="my-4">Welcome to your profile, {this.state.loggedInUser.username}
  <br />
    <small>Have you been waste-less today?</small>
  </h3>

  <div className="card mb-4">
    <img className="card-img-top" src="http://placehold.it/750x300" alt="default"/>
    <div className="card-body">
      {/* <h2 className="card-title">Post Title</h2> */}
      <p className="card-text"> <h4>Motto:</h4> "Es gibt viel, was du selbst tun kannst."</p>
      <Link to="#" className="btn btn-primary">Edit Profile</Link>
    </div>
    <div class="card-footer text-muted">
      Currently part of the league <Link to="/" className="card-link">Dashboard</Link>
      
    </div>
  </div>


      </div>

 <div className="col-md-4">

<div className="card my-4">
  <h5 className="card-header">Search for new tasks</h5>
  <div className="card-body">
    <div className="input-group">
      <input type="text" class="form-control" placeholder="Search for..."/>
      <span className="input-group-btn">
        <button className="btn btn-secondary" type="button">Go!</button>
      </span>
    </div>
  </div>
</div>

<div className="card my-4">
  <h5 className="card-header">Categories</h5>
  <div className="card-body">
    <div className="row">
      <div className="col-lg-6">
        <ul className="list-unstyled mb-0">
          <li>
            <Link to="#">Bathroom</Link>
          </li>
          <li>
            <Link to="#">To go</Link>
          </li>
          <li>
            <Link to="#">Shopping</Link>
          </li>
        </ul>
      </div>
      <div className="col-lg-6">
        <ul className="list-unstyled mb-0">
          <li>
            <Link to="#">Kitchen</Link>
          </li>
          <li>
            <Link to="#">with Kids</Link>
          </li>
          <li>
            <Link to="#">Cleaning</Link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>

<div className="card my-4">
  <h5 className="card-header">Side Widget</h5>
  <div className="card-body">
    You can put anything you want inside of these side widgets. They are easy to use, and feature the new Bootstrap 4 card containers!
  </div>
</div>

</div>

</div>

</div>


      // </div>


      // </div>
   
    );
  }
}

export default Profile;