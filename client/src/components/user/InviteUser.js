import React, { Component } from "react";
import UserService from "../user/user-service";

class InviteUser extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      message: ""
    };
    this.userService = new UserService();
  }

  inviteUser = event => {
    event.preventDefault();
    this.userService
      .inviteUser(this.state.email, this.props.user.username)
      .then(response => {
        if (response.msg === "success") {
          this.setState({ message: "User has been invited" });
          this.resetForm();
        } else if (response.msg === "fail") {
          this.setState({ message: "Something went wrong, please try again." });
        }
      })
      .catch(err => console.log(err));
  };

  resetForm() {
    document.getElementById("invite-form").reset();
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    // console.log(this.state);

    return (
      <div className="mt-3 white-top">
        <form onSubmit={this.inviteUser} id="invite-form">
          <label className="label">Your friends aren't registered yet?</label>
          <div className="container-fluid">
            <div className="row noborder">
              <div className="col-10">
                <input
                  onChange={e => this.handleChange(e)}
                  type="email"
                  // className="form-control"
                  className="input search-bar form-control"
                  name="email"
                  placeholder="Invite them by email"
                  value={this.state.email}
                />
              </div>

              <div className="col-2">
                <button
                  className="btn btn-primary"
                  type="submit"
                  value="Submit"
                >
                  Invite
                </button>
              </div>
            </div>
            <div className="message blue noborder">
              {this.state.message.length > 0 && <p>{this.state.message}</p>}
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default InviteUser;
