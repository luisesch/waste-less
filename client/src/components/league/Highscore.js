import React, { Component } from "react";
import DeleteMemberButton from "./DeleteMemberButton";

class ActiveLeague extends Component {
  render() {
    return (
      <div>
        {this.props.status === "short" ? (
          <h4>- Top 3 -</h4>
        ) : (
          <h4>- All members -</h4>
        )}

        <table className="table text-center">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody>
            {this.props.status === "short" &&
              this.props.members.map((member, index) => {
                if (index <= 2) {
                  return (
                    <tr
                      key={index}
                      className={
                        member._id === this.props.userInSession._id
                          ? "blue noborder"
                          : ""
                      }
                    >
                      <th scope="row">
                        {" "}
                        {this.props.edit &&
                        member._id !== this.props.userInSession._id ? (
                          <DeleteMemberButton user={member}>
                            Delete
                          </DeleteMemberButton>
                        ) : (
                          <p>{index + 1}</p>
                        )}
                      </th>
                      <td>{member.username}</td>
                      {member.league.confirmed ? (
                        <td>{member.score}</td>
                      ) : (
                        <td>Waiting</td>
                      )}
                    </tr>
                  );
                } else {
                  return null;
                }
              })}
            {this.props.status === "long" &&
              this.props.members.map((member, index) => {
                return (
                  <tr
                    key={index}
                    className={
                      member._id === this.props.userInSession._id
                        ? "blue noborder"
                        : ""
                    }
                  >
                    <th scope="row">
                      {" "}
                      {this.props.edit &&
                      member._id !== this.props.userInSession._id ? (
                        <DeleteMemberButton user={member}>
                          Delete
                        </DeleteMemberButton>
                      ) : (
                        <p>{index + 1}</p>
                      )}
                    </th>
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
