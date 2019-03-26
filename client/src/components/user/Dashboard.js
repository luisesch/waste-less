import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "../auth/auth-service";
import UserSearch from "../user/UserSearch";
import "bootstrap/dist/css/bootstrap.css";
import "./Dashboard.css";
import LeagueService from "../league/league-service";
import UserService from "../user/user-service";
import Moment from "moment";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: {},
      filteredUsers: [],
      users: null,
      selectedMember: [],
      members: [],
      league: {},
      endDate: "03/21/2019",
      firstThree: []
    };
    this.authService = new AuthService();
    this.leagueService = new LeagueService();
    this.userService = new UserService();
  }

  componentDidMount() {
    // get logged in user and add to state
    this.authService.loggedin().then(response => {
      this.setState({
        loggedInUser: response
      });
      // if user has no league
      if (!this.state.loggedInUser.league.hasOwnProperty("info")) {
        this.setState({ league: false });
        // if user has league
      } else {
        const leagueId = this.state.loggedInUser.league.info;
        //get user's league
        this.leagueService
          .getLeague(leagueId)
          .then(response => {
            this.setState({
              league: response
              // endDate: Moment(response.startDate, "L")
              //   .add(30, "days")
              //   .calendar()
            });
          })
          .catch(err => console.log(err));

        this.leagueService
          .getMembers(leagueId)
          .then(response => {
            let sortedMembers = [...response];
            let firstThree = [];
            sortedMembers.sort((a, b) => b.score - a.score);
            firstThree = sortedMembers.slice(0, 2);
            this.setState({ members: response, firstThree: firstThree });
          })
          .catch(err => console.log(err));

        this.userService
          .showAll()
          .then(response => {
            this.setState({ users: response });
          })
          .catch(err => console.log(err));
      }
    });
  }

  searchUserHandler = query => {
    if (query.length < 1) {
      this.setState({ filteredUsers: [] });
    } else {
      let filteredUsers = this.state.users.filter(user => {
        const userLowerCase = user.username.toLowerCase();
        const filter = query;
        return userLowerCase.includes(filter);
      });
      this.setState({ filteredUsers: filteredUsers });
    }
  };

  addUser = async event => {
    const userId = event.target.value;
    const leagueId = this.state.league._id;
    await this.leagueService.addMember(leagueId, userId);

    this.leagueService
      .getMembers(leagueId)
      .then(response => this.setState({ members: response }))
      .catch(err => console.log(err));
  };

  deleteMember = async event => {
    let leagueId = this.state.league._id;
    let memberId = event.target.value;
    await this.leagueService.deleteMember(leagueId, memberId);

    this.leagueService
      .getMembers(leagueId)
      .then(response => this.setState({ members: response }))
      .catch(err => console.log(err));
  };

  enterLeague = () => {
    this.leagueService
      .enterLeague(this.state.loggedInUser._id, this.state.league._id)
      .then(response => this.setState({ loggedInUser: response }))
      .catch(err => console.log(err));
  };

  startLeague = async () => {
    const leagueId = this.state.league._id;
    await this.leagueService.startLeague(this.state.league._id);

    this.leagueService
      .getLeague(leagueId)
      .then(response => this.setState({ league: response }))
      .catch(err => console.log(err));
  };

  // check, if league is over/30 days have passed
  leagueOver = () => {
    const leagueId = this.state.loggedInUser.league.info;
    if (
      Moment().format("L") === this.state.endDate ||
      (Moment(this.state.endDate, "L")
        .fromNow()
        .indexOf("ago") >= 0 &&
        this.state.league.status === "active")
    ) {
      this.leagueService
        .endLeague(leagueId)
        .then(response => {
          // console.log(response);
          this.setState({
            league: response
          });
        })
        .catch(err => console.log(err));
    }
  };

  render() {
    if (this.state.league === null) {
      return <p>Loading</p>;
    }
    // if user isn't part of any league
    else if (
      !this.state.league ||
      Object.entries(this.state.league).length === 0
    ) {
      return (
        <div>
          <p>You aren't currently member of any league.</p>
          <Link to="/newleague">Create new league</Link>
        </div>
      );
      // if league has recently been completed and user has joined a new league
    } else if (this.state.league.status === "completed") {
      this.leagueOver();
      return (
        <div>
          <p>
            League {this.state.league.name} has been completed -
            congratulations!
          </p>
          <p>
            Check out the results{" "}
            <Link to={`/archive/${this.state.league._id}`}>here</Link>
          </p>{" "}
          <br /> or <br />
          <p>
            Create a new league <Link to="/newleague">here</Link>
          </p>
        </div>
      );
    } else if (!this.state.loggedInUser.league.confirmed) {
      return (
        <p>
          You have been invited to join the league
          <strong>{this.state.league.name}</strong>.
          <br />
          <button onClick={this.enterLeague}>Join league</button>
        </p>
      );
    } else if (this.state.league.status === "waiting") {
      return (
        <div>
          <h2>Your league</h2>
          <h3>Name</h3>
          <p>{this.state.league.name}</p>

          <h3>Members</h3>
          {/* show delete button and status of members, only if loggedin user s administrator */}
          {this.state.league.administrator._id ===
          this.state.loggedInUser._id ? (
            <ul>
              <li>
                Admin:
                {this.state.league.administrator.username}
              </li>

              {this.state.members.map((member, index) => {
                return (
                  <li key={index}>
                    {member.username} <br />
                    {member.league.confirmed ? "confirmed" : "waiting"}
                    <br />
                    <button
                      name="deleteMember"
                      className="btn btn-primary"
                      type="submit"
                      value={member._id}
                      onClick={this.deleteMember}
                    >
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            // if loggedin user is not administrator, only show member names
            <ul>
              <li>
                Admin:
                {this.state.league.administrator.username}
              </li>

              {this.state.members.map((member, index) => {
                return <li key={index}>{member.username}</li>;
              })}
            </ul>
          )}

          {/* only show add option, if loggedin user is administrator */}
          {this.state.league.administrator._id ===
          this.state.loggedInUser._id ? (
            <div>
              <p>
                <strong>Add members</strong>
              </p>
              <UserSearch searchUsers={this.searchUserHandler} />
              <ul>
                {this.state.filteredUsers.map((user, index) => {
                  // turn object into string
                  return (
                    <li key={index}>
                      {user.username}
                      <button
                        className="btn btn-primary"
                        htmlFor="user"
                        value={user._id}
                        onClick={this.addUser}
                      >
                        Add
                      </button>
                    </li>
                  );
                })}
              </ul>
              {/* check, if all members have confirmed */}
              {this.state.members.every(member => {
                return member.league.confirmed === true;
              }) ? (
                <button onClick={this.startLeague} className="btn btn-primary">Let the games begin</button>
              ) : (
                <button className="btn btn-primary">Waiting for all members to confirm</button>
              )}
            </div>
          ) : null}
        </div>
      );
    } else {
      this.leagueOver();
      return (
        <div>
          <div className="row align-items-center my-5">
            <div className="col-lg-7">
              <img
                className="img-fluid rounded mb-4 mb-lg-0"
                src={this.state.league.photo}
                alt=""
              />
                          
            </div>
            <div className="col-lg-5">
              <h1 className="font-weight-light">
                Dashboard of {this.state.league.name}
              </h1>
              <br />
              <h5>-Best of the League-</h5>

              <div className="rightBox">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.members.map((member, index) => {
                      return (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{member.username}</td>
                          <td>{member.score}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <th />
                      <td>
                        <Link to="/myleague/highscore">See all</Link>
                      </td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="middleBlock card text-white my-5 py-4 text-center">
            <div className="card-body">
              <div className="text m-0">
                <h3>
                  Your league ends {Moment(this.state.endDate, "L").fromNow()},{" "}
                  {this.state.loggedInUser.username}
                </h3>
                <h5>What else can you do to rise your score today?</h5>
                <Link to="/tasks">Browse tasks</Link>
              </div>
            </div>
          </div>
          <br />

          <p className="m-0">See the latest tasks of your team</p>
          <div className="row">
            <div className="card col-xs-12 col-md-3 mb-5 mt-3 mx-3">
              <div className="card-body h-100">
                <h5 className="card-title">Card title</h5>
                <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <Link to="#" className="card-link">
                  Card link
                </Link>
                <Link to="#" className="card-link">
                  Another link
                </Link>
              </div>
            </div>

            <div className="card col-xs-12 col-md-3 mb-5 mt-3 mx-3">
              <div className="card-body h-100">
                <h5 className="card-title">Card title</h5>
                <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <Link to="#" className="card-link">
                  Card link
                </Link>
                <Link to="#" className="card-link">
                  Another link
                </Link>
              </div>
            </div>

            <div className="card col-xs-12 col-md-3 mb-5 mt-3 mx-3">
              <div className="card-body h-100">
                <h5 className="card-title">Card title</h5>
                <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <Link to="#" className="card-link">
                  Card link
                </Link>
                <Link to="#" className="card-link">
                  Another link
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Dashboard;
