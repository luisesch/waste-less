import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "./auth/auth-service";
import "./Navbar.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

function MyNavbar(props) {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const service = new AuthService();
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(props.userInSession);
  }, [props.userInSession]);

  const logoutUser = () => {
    service.logout().then(() => {
      setLoggedInUser(null);
      props.getUser(null);
      navigate("/");
    });
  };

  //if user is logged in
  if (loggedInUser) {
    return (
      <div className="blue">
        <Navbar bg="light" expand="lg" sticky="top">
          <Navbar.Brand href="/myleague">
            <img src="/images/Schwarz_wasteless-02.png" alt="" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="justify-content-end" style={{ width: "100%" }}>
              <Nav.Link
                href="/tasks"
                style={{
                  margin: "8px 8px 0px 8px",
                }}
              >
                Tasks
              </Nav.Link>
              <Nav.Link
                href="/myleague"
                style={{
                  margin: "8px 8px 0px 8px",
                }}
              >
                My league
              </Nav.Link>
              <Nav.Link
                href="/profile"
                style={{
                  margin: "8px 8px 0px 8px",
                }}
              >
                Profile
              </Nav.Link>
              <Nav.Link>
                <button
                  onClick={logoutUser}
                  type="button"
                  className="btn Navbar-btn p-2 mx-8"
                >
                  Logout
                </button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
    // if user is not logged in
  } else {
    return (
      <div className="blue">
        <Navbar bg="light" expand="lg" sticky="top">
          <Navbar.Brand href="/">
            <img src="/images/Schwarz_wasteless-02.png" alt="" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="justify-content-end" style={{ width: "100%" }}>
              <Nav.Link
                href="/login"
                style={{
                  margin: "8px 8px 0px 8px",
                }}
              >
                Login
              </Nav.Link>
              <Nav.Link
                href="/"
                style={{
                  margin: "8px 8px 0px 8px",
                }}
              >
                Signup
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default MyNavbar;
