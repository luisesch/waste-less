import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import AuthService from "../auth/auth-service";
import LeagueService from "../league/league-service";
import ArchiveDetail from "./ArchiveDetail";

import "bootstrap/dist/css/bootstrap.css";
import "./Archive.css";

class Archive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: {},
      leagues: []
    };
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
        this.leagueService
          .getArchive(this.state.loggedInUser._id)
          .then(response => {
            response.completedLeagues.reverse();
            this.setState({ leagues: response.completedLeagues });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  render() {
    if (this.state.leagues.length <= 0) {
      return <p>Loading</p>;
    } else {
      return (
        <div>
          <h2>Completed leagues</h2>
          <div className="row p-3">
            {this.state.leagues.map((league, index) => {
              return (
                <div key={index} className="col-3">
                  <Link to={`/archive/${league.info._id}`}>
                    <button className="btn btn-outline-info btn-lg w-100">
                      {league.info.name}
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
          {this.props.match.params.id && (
            <ArchiveDetail id={this.props.match.params.id} />
          )}
        </div>
      );
    }
  }
}

export default withRouter(Archive);
