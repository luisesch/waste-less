import React, { Component } from "react";

class ActiveLeague extends Component {
  render() {
    return (
      <div>
        <h4>- Top 3 -</h4>

        <table className="table text-center">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody>
            {this.props.firstThree.map((member, index) => {
              return (
                <tr
                  key={index}
                  className={
                    member._id === this.props.userInSession._id
                      ? "table-info"
                      : ""
                  }
                >
                  <th scope="row">{index + 1}</th>
                  <td>{member.username}</td>
                  <td>{member.score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ActiveLeague;
