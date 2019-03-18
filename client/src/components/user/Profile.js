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
      <div>

{/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> */}

{/* <div className="card">
  <img 
    src="/image/default_profile.jpg" 
    alt="John"/>
  <h1>John Doe</h1>
  <p className="title">CEO & Founder, Example</p>
  <p>Harvard University</p>
  <p><button>Contact</button></p>
</div> */}
      
        <div className="headProfile">
        <br />
         <div className="profilePic centered">
						<img
							src="/image/default_profile.jpg"
							className="rounded profile-pic"
              alt="default"
						/>
            </div>
            <br />
            </div>
        Welcome to your dashboard, {this.state.loggedInUser.username} <br />
        Find new tasks <Link to="/tasks">here</Link>
        Create new league <Link to="/newleague">here</Link>
        Check out your league <Link to="/league">here</Link>
      </div>
   
    );
  }
}

export default Profile;