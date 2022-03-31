import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../auth/auth-service";
import LeagueService from "../league-service";
import ArchiveDetail from "./ArchiveDetail";

import "./Archive.css";

class Archive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: {},
      leagues: [],
    };
    this.authService = new AuthService();
    this.leagueService = new LeagueService();
  }

  componentDidMount() {
    // get logged in user and add to state
    this.authService
      .loggedin()
      .then((response) => {
        this.setState({
          loggedInUser: response,
        });
        this.leagueService
          .getArchive(this.state.loggedInUser._id)
          .then((response) => {
            response.completedLeagues.reverse();
            this.setState({ leagues: response.completedLeagues });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  render() {
    if (this.state.leagues.length <= 0) {
      return <p>Loading...</p>;
    } else {
      return (
        <div className="Archive p-5">
          <h1 className="font-weight-light Quicksand">Archive</h1>
          <hr className="w-75" />
          <h4 className="mb-5">Have a look at what you've achieved so far</h4>
          <div className="container-fluid">
            <div className="row p-3">
              {this.state.leagues.map((league, index) => {
                return (
                  <div key={index} className="col-md-3 col-xs-6 mb-2">
                    <Link
                      to={`/archive/${league.info._id}`}
                      style={{ textDecoration: "underline", color: "#1b2f33" }}
                    >
                      <button className="btn Home-btn btn-lg w-100">
                        {league.info.name}
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
          {this.props.match.params.id && (
            <ArchiveDetail id={this.props.match.params.id} />
          )}
        </div>
      );
    }
  }
}

export default Archive;
