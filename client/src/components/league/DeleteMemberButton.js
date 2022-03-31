import React from "react";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";

import LeagueService from "./league-service";

function DeleteMemberButton(props) {
  const navigate = useNavigate();
  const leagueService = new LeagueService();

  const deleteMember = () => {
    let leagueId = props.user.league.info;
    let memberId = props.user._id;
    leagueService
      .deleteMember(leagueId, memberId)
      .then((response) => {
        navigate("/myleague");
      })
      .catch((err) => console.log(err));
  };

  return (
    <Popup
      trigger={<button className="btn Home-btn">{props.children}</button>}
      position="right center"
    >
      <div>
        <p>Are you sure?</p>
        <button className="btn btn-danger" onClick={deleteMember}>
          Yes!
        </button>
      </div>
    </Popup>
  );
}

export default DeleteMemberButton;
