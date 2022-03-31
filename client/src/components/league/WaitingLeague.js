import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import UserSearch from "../user/UserSearch";
import LeagueService from "../league/league-service";
import UserService from "../user/user-service";
import "./WaitingLeague.css";
import DeleteMemberButton from "./DeleteMemberButton";

function WaitingLeague(props) {
  const [loggedInUser] = useState(props.userInSession);
  const [league, setLeague] = useState(props.league);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState(null);
  const [members, setMembers] = useState([]);

  const leagueService = new LeagueService();
  const userService = new UserService();
  const navigate = useNavigate();

  useEffect(() => {
    leagueService
      .getMembers(loggedInUser.league.info)
      .then((response) => setMembers(response))
      .catch((err) => console.log(err));

    // get all users except the loggedin, so they can't select themselves
    userService
      .showAll()
      .then((response) => {
        for (var i = response.length - 1; i >= 0; i--) {
          if (response[i].username === loggedInUser.username) {
            response.splice(i, 1);
          }
        }
        setUsers(response);
      })
      .catch((err) => console.log(err));
  }, []);

  const searchUserHandler = (query) => {
    if (query.length < 1) {
      setFilteredUsers([]);
    } else {
      // only show users that aren't currently in any league
      let leaguelessUsers = users.filter((user) => {
        return !user.league.hasOwnProperty("info");
      });

      let filteredUsers = leaguelessUsers.filter((user) => {
        const userLowerCase = user.username.toLowerCase();
        const filter = query.toLowerCase();
        return userLowerCase.includes(filter);
      });
      setFilteredUsers(filteredUsers);
    }
  };

  const addUser = async (event) => {
    const userId = event.target.value;
    const leagueId = league._id;
    await leagueService.addMember(leagueId, userId);

    leagueService
      .getMembers(leagueId)
      .then((response) => setMembers(response))
      .catch((err) => console.log(err));

    // get all users again to see changes
    userService
      .showAll()
      .then((response) => {
        for (var i = response.length - 1; i >= 0; i--) {
          if (response[i].username === loggedInUser.username) {
            response.splice(i, 1);
          }
        }
        setUsers(response);
        setFilteredUsers([]);
      })
      .catch((err) => console.log(err));
  };

  const startLeague = async () => {
    const leagueId = league._id;
    const duration = league.duration;
    await leagueService.startLeague(league._id, duration);

    leagueService
      .getLeague(leagueId)
      .then((response) => {
        setLeague(response);

        navigate("/myleague");
      })
      .catch((err) => console.log(err));
  };

  if (Object.entries(league).length === 0) {
    return <p>Loading...</p>;
  } else {
    return (
      <div className="mt-3">
        <div className="container px-5">
          <div className="row noborder">
            <div className="col-md-5 col-xs-12">
              <h2 className="font-weight-light Quicksand mb-5">Your league</h2>
              <h3 className="text-left">Name: {league.name}</h3>
              <h3 className="text-left">Members:</h3>
              {/* show delete button and status of members, only if loggedin user s administrator */}
              {league.administrator._id === loggedInUser._id ? (
                <div className="table-responsive">
                  <table className="table">
                    <tbody>
                      {members.map((member, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">
                              <img
                                className="Waiting-profilePic rounded"
                                src={member.photo}
                                alt="default"
                              />
                            </th>
                            <td>{member.username}</td>
                            <td>
                              {member._id === league.administrator._id
                                ? "admin"
                                : member.league.confirmed
                                ? "confirmed"
                                : "waiting"}
                            </td>
                            <td>
                              {/* make sure admin can't delete himself */}
                              {member._id !== loggedInUser._id && (
                                <DeleteMemberButton user={member}>
                                  Delete
                                </DeleteMemberButton>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                // if loggedin user is not administrator, only show member names
                <div>
                  {members.map((member, index) => {
                    return (
                      <div key={index} className="text-left">
                        {member.username}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* only show add option, if loggedin user is administrator */}
              {league.administrator._id === loggedInUser._id ? (
                <div>
                  <UserSearch searchUsers={searchUserHandler} />
                  {filteredUsers.map((user, index) => {
                    // turn object into string
                    return (
                      <div key={index}>
                        <button
                          className="btn btn-light w-100"
                          htmlFor="user"
                          value={user._id}
                          onClick={addUser}
                        >
                          {user.username}
                        </button>
                        <br />
                      </div>
                    );
                  })}

                  {/* check, if all members have confirmed */}
                  {members.every((member) => {
                    return member.league.confirmed === true;
                  }) ? (
                    <button
                      onClick={startLeague}
                      className="btn Home-btn mt-3 mb-3"
                    >
                      Let the games begin
                    </button>
                  ) : (
                    <button className="btn btn-light mt-3 mb-3">
                      Waiting for all members to confirm
                    </button>
                  )}
                </div>
              ) : null}
            </div>

            <div className="col-md-7 col-xs-12">
              <img
                className="img-fluid rounded"
                src="https://consciousbychloe.imgix.net/2018/06/consciousbychloe-5-Rs-zero-waste-ashley-hardy-vase-1.jpg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WaitingLeague;
