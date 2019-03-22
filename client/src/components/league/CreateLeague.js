import React, { Component } from "react";
import LeagueService from "./league-service";
import UserService from "../user/user-service";
import UserSearch from "../user/UserSearch";
import AuthService from "../auth/auth-service";

class CreateLeague extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedInUser: null,
      name: "",
      members: [],
      users: null,
      filteredUsers: []
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
    // get all users
    this.userService
      .showAll()
      .then(response => {
        this.setState({ users: response });
      })
      .catch(err => console.log(err));
  }

  handleChange = event => {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  };

  membersArr = [];

  selectUser = event => {
    // turn string back into json
    let memberAsObject = JSON.parse(event.target.value);
    this.membersArr.push(memberAsObject);
    this.setState({ members: this.membersArr });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    const name = this.state.name;
    const administrator = this.state.loggedInUser._id;

    let members = [];
    this.state.members.forEach(member => {
      members.push({ info: member._id, confirmed: false });
    });

    this.leagueService
      .create(name, administrator, members)
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
      let filteredUsers = this.state.users.filter(user => {
        console.log(user);
        const userLowerCase = user.username.toLowerCase();
        const filter = query;
        return userLowerCase.includes(filter);
      });
      this.setState({ filteredUsers: filteredUsers });
    }
  };

  render() {
    return (
      <div className="field">
        <form onSubmit={this.handleFormSubmit}>
          <label className="label">Name of team:</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="name"
              onChange={this.handleChange}
              value={this.state.name}
            />
          </div>

          {this.state.members.map((member, index) => {
            return (
              <div key={index}>
                <p>{member.username}</p>
              </div>
            );
          })}

          <UserSearch searchUsers={this.searchUserHandler} />

          <div className="form-check">
            {this.state.filteredUsers.map((user, index) => {
              // turn object into string
              let userAsString = JSON.stringify(user);
              return (
                <div key={index}>
                  <input
                    onChange={this.selectUser}
                    className="form-control"
                    type="checkbox"
                    name="members"
                    value={userAsString}
                    id="user"
                  />
                  <label className="form-check-label" htmlFor="user">
                    {user.username}
                  </label>
                </div>
              );
            })}
          </div>

          <input className="button is-info" type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default CreateLeague;
