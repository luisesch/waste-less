import React, { Component } from "react";
import { Link } from "react-router-dom";

class NoLeague extends Component {
  render() {
    return (
      <div className="mt-3">
        <div className="container px-5">
          <div className="row noborder">
            <div className="col-md-7 col-xs-12 left mb-3">
              <img
                className="img-fluid rounded"
                src="https://www.longevitylive.com/wp-content/uploads/2017/09/art-close-up-ecology-886521.jpg"
                alt=""
              />
            </div>
            <div className="col-md-5 col-xs-12 right">
              <h2 className="font-weight-light Quicksand mb-5">
                You aren't currently member of any league.
              </h2>

              <button className="btn btn-lg btn-light mb-3">
                <Link
                  to="/newleague"
                  style={{
                    textDecoration: "none",
                    color: "black"
                  }}
                >
                  Create new league
                </Link>
              </button>

              {this.props.user.completedLeagues.length > 0 && (
                <p>
                  or
                  <br />
                  <button className="btn btn-lg btn-light mt-3">
                    <Link
                      to="/archive"
                      style={{
                        textDecoration: "none",
                        color: "black"
                      }}
                    >
                      Check out your archive
                    </Link>
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NoLeague;
