import React, { Component } from "react";
import ContactService from "./contact-service";

class Welcome extends Component {
  constructor(props) {
    super(props);

    this.contactService = new ContactService();
  }

  handleSubmit = event => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    this.contactService.sendMessage(name, email, message).then(response => {
      if (response.msg === "success") {
        alert("Message Sent.");
        this.resetForm();
      } else if (response.msg === "fail") {
        alert("Message failed to send.");
      }
    });
  };

  resetForm() {
    document.getElementById("contact-form").reset();
  }

  render() {
    return (
      <div className="contact px-5 pb-5 pt-1">
        <h1 className="font-weight-light Quicksand">Contact us</h1>
        <hr className="w-75" />
        <h4 className="mb-5 mx-2">What's on your mind?</h4>
        <div className="cotainer-fluid">
          <div className="row noborder">
            <div className="col-md-8 col-xs-12">
              <form
                id="contact-form"
                onSubmit={this.handleSubmit}
                method="POST"
              >
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" className="form-control" id="name" />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    aria-describedby="emailHelp"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea className="form-control" rows="5" id="message" />
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
            <div className="col-md-4 col-xs-12 text-left border-left">
              <address>
                Janine & Luise <hr /> Ironhack Berlin
                <hr />
                waste.less.ironhack@gmail.com
                <hr />
              </address>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Welcome;
