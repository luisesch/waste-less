import React, { Component } from "react";
import "./Footer.css";

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
                <p>Contact</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default Footer;
