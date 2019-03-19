import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "../auth/auth-service";
import "bootstrap/dist/css/bootstrap.css";
import "./Dashboard.css";
import LeagueService from "../league/league-service";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedInUser: {}, members: [], league: {} };
    this.authService = new AuthService();
    this.leagueService = new LeagueService();
  }

  componentDidMount() {
    // get logged in user and add to state
    this.authService
      .loggedin()
      .then(response => {
        this.setState({
          loggedInUser: response
        });

        const leagueId = this.state.loggedInUser.league.info;

        this.leagueService
          .getLeague(leagueId)
          .then(response => this.setState({ league: response }))
          .catch(err => console.log(err));

        this.leagueService.getMembers(leagueId).then(response => {
          let sortedMembers = [...response];
          let firstThree = [];
          sortedMembers.sort((a, b) => b.score - a.score);
          firstThree = sortedMembers.slice(0, 2);
          this.setState({ members: firstThree });
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <div className="row align-items-center my-5">
          <div className="col-lg-7">
            <img
              className="img-fluid rounded mb-4 mb-lg-0"
              src="http://placehold.it/900x400"
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
                      <Link to="/league">See all</Link>
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
              <h3>You are on day XX, {this.state.loggedInUser.username}</h3>
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

export default Dashboard;
