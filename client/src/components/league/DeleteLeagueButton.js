import React from "react";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";

import LeagueService from "./league-service";

function DeleteMemberButton(props) {
  const navigate = useNavigate();
  const leagueService = new LeagueService();

  const deleteLeague = () => {
    let leagueId = props.league._id;
    leagueService
      .deleteLeague(leagueId)
      .then((response) => {
        navigate("/myleague");
      })
      .catch((err) => console.log(err));
  };

  return (
    <Popup
      trigger={<button className="btn btn-light mx-2">{props.children}</button>}
      position="left center"
    >
      <div>
        <p>Are you sure?</p>
        <button className="btn btn-danger" onClick={deleteLeague}>
          Yes!
        </button>
      </div>
    </Popup>
  );
}

export default DeleteMemberButton;
