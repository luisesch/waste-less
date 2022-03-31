import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "./auth-service";

import "./Home.css";
import Signup from "./Signup";

function Home(props) {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [passsword, setPassword] = useState("");
  const service = new AuthService();
  const navigate = useNavigate();

  const signup = (username, password, email) => {
    service.signup(username, password, email).then((response) => {
      if (response.message) {
        setMessage(response.message);
      } else {
        setUsername("");
        setPassword("");
        setMessage("");
        props.getUser(response);
        navigate("/myleague");
        props.getUser(response);
        navigate("/welcome");
      }
    });
  };

  return (
    <div className="Home container-fluid">
      <div className="row p-0 m-0">
        <div className="leftBar col-xs-12 col-md-8 pt-5">
          <h1 className="header">WASTE-LESS</h1>
          <h4 className="subheader">There is no plan(et) B</h4>
        </div>
        <div className="rightBar col-xs-12 col-md-4 pt-5 px-5">
          <Signup signup={signup} message={message} />
        </div>
      </div>
      <div className="about pt-3 px-5 text-right">
        <h4>About</h4>
        <p>
          You love a good challenge? Then waste-less might be just the right
          thing for you. Invite your friends, family or colleagues and compete
          against each other in avoiding waste. Whoever collects most points
          during a week, month or quarter will win the league!
          <br /> <br />
          Waste-less is not about perfection, it's about making better decisions
          – one step at a time. We believe that small efforts may lead to a big
          impact, so start with just one single change and see where it takes
          you.
        </p>
      </div>
    </div>
  );
}

export default Home;
