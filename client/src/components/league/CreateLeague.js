import React, { Component } from "react";
import LeagueService from "./league-service";
import UserService from "../user/user-service";
import UserSearch from "../user/UserSearch";
import AuthService from "../auth/auth-service";
import "./CreateLeague.css";
import InviteUser from "../user/InviteUser";

class CreateLeague extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedInUser: null,
      name: "",
      members: [],
      users: null,
      filteredUsers: [],
      picture: null,
      duration: 30
    };
    this.leagueService = new LeagueService();
    this.userService = new UserService();
    this.authService = new AuthService();
  }

  componentDidMount() {
    this.authService
      .loggedin()
      .then(response => {
        this.setState({
          loggedInUser: response
        });
      })
      .catch(err => console.log(err));

    // get all users except the loggedin, so they can't select themselves
    this.userService
      .showAll()
      .then(response => {
        for (var i = response.length - 1; i >= 0; i--) {
          if (response[i].username === this.state.loggedInUser.username) {
            response.splice(i, 1);
          }
        }
        this.setState({ users: response });
      })
      .catch(err => console.log(err));
  }

  //upload a league picture
  handleChange(e) {
    this.setState({
      file: e.target.files[0]
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.userService.addPicture(this.state.file, this.state.league._id);
  }

  handleChange = event => {
    let { name, value } = event.target;
    if (name === "picture") {
      this.setState({ picture: event.target.files[0] });
    } else {
      this.setState({ [name]: value });
    }
  };

  membersArr = [];

  selectUser = event => {
    this.membersArr.push(event.target.value);

    // make sure user disappears from available user list once he is selected
    let array = this.state.users;
    let user = event.target.value;
    for (var i = array.length - 1; i >= 0; i--) {
      if (array[i].username === user) {
        array.splice(i, 1);
      }
    }

    this.setState({
      members: this.membersArr,
      users: array,
      filteredUsers: []
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    const name = this.state.name;
    const picture = this.state.picture;
    const administrator = this.state.loggedInUser._id;
    const members = this.state.members;
    const duration = this.state.duration;

    this.leagueService
      .create(name, administrator, members, picture, duration)
      .then(response => {
        this.setState({
          name: "",
          members: []
        });
        this.props.history.push("/myleague");
      })
      .catch(error => console.log(error));
  };

  searchUserHandler = query => {
    if (query.length < 1) {
      this.setState({ filteredUsers: [] });
    } else {
      // only show users that aren't currently in any league
      let leaguelessUsers = this.state.users.filter(user => {
        return !user.league.hasOwnProperty("info");
      });

      let filteredUsers = leaguelessUsers.filter(user => {
        const userLowerCase = user.username.toLowerCase();
        const filter = query.toLowerCase();
        return userLowerCase.includes(filter);
      });

      this.setState({ filteredUsers: filteredUsers });
    }
  };

  setDuration = event => {
    event.preventDefault();
    this.setState({ duration: Number(event.target.value) });
  };

  render() {
    return (
      <div className="card container">
        <div className="createLeague card-body">
          <div className="row noborder">
            <div className="col-md-7 left">
              <img
                className="img-fluid rounded mb-4 mb-lg-0"
                src="https://www.e-fellows.net/var/ezflow_site/storage/images/medienbibliothek/_bilder/zero-waste-glaeser-muesli-1280x720-unsplash.com/42747125-1-ger-DE/Zero-Waste-Glaeser-Muesli-1280x720-unsplash.com_full_image.jpg"
                alt=""
              />
            </div>
            <div className="col-md-5 right">
              <h1 className="card-title font-weight-light">
                Create new league{" "}
              </h1>
              <br />
              <div className="field">
                <form onSubmit={this.handleFormSubmit}>
                  {/* <input type="file" name="picture" onChange={(e) => this.handleChange(e)} /> <br /> */}
                  <div className="control">
                    <input
                      className="input form-control"
                      type="text"
                      name="name"
                      onChange={this.handleChange}
                      value={this.state.name}
                      placeholder="Name of the league"
                      required
                    />

                    <br />
                  </div>
                  {this.state.members.map((member, index) => {
                    return (
                      <div key={index}>
                        <p>{member}</p>
                      </div>
                    );
                  })}
                  <UserSearch searchUsers={this.searchUserHandler} />
                  <div className="form-check">
                    {this.state.filteredUsers.map((user, index) => {
                      return (
                        <button
                          key={index}
                          onClick={this.selectUser}
                          className="form-control btn btn-light"
                          name="members"
                          value={user.username}
                          id="user"
                        >
                          {user.username}
                        </button>
                      );
                    })}
                  </div>
                  <br />

                  <button value="7" onClick={this.setDuration}>
                    7 days
                  </button>
                  <button value="30" onClick={this.setDuration}>
                    30 days
                  </button>

                  <br />
                  <label>Upload League Picture</label>
                  <input
                    type="file"
                    name="picture"
                    onChange={e => this.handleChange(e)}
                  />

                  <br />
                  <br />
                  <input
                    className="btn btn-primary"
                    type="submit"
                    value="Submit"
                  />
                </form>
              </div>
              <InviteUser user={this.state.loggedInUser} />
            </div>
          </div>
        </div>

        <div className="card-footer text-muted">Let the games begin! </div>
      </div>
    );
  }
}

export default CreateLeague;
