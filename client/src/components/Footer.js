import React, { Component } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

class Footer extends Component {
  render() {
    return (
      <div className="Foot">
        <footer className="page-footer font-small light-green pt-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-6 text-left">
                <p>
                  © 2018 Copyright:
                  <strong> Luise & Janine – Ironhackers</strong>
                </p>
              </div>
              <div className="col-6 text-right">
                {" "}
                <Link
                  to="/contact"
                  style={{ textDecoration: "underline", color: "#1b2f33" }}
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default Footer;
