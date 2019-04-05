import React, { Component } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

class Footer extends Component {
  render() {
    return (
      <div className="Foot p-3 mt-3">
        <footer className="page-footer font-small light-green ">
          <div className="container-fluid">
            <div className="row noborder">
              <div className="col-6 text-left">
                <p>
                  © 2019 Copyright:
                  <strong> Luise & Janine – Ironhackers</strong>
                </p>
              </div>
              <div className="col-6 text-right">
                {" "}
                <Link
                  to="/contact"
                  style={{ textDecoration: "none", color: "#1b2f33" }}
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
