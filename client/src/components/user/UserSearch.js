import React, { Component } from "react";

class UserSearch extends Component {
  constructor() {
    super();

    this.state = {
      query: ""
    };
  }

  handleChange = event => {
    event.preventDefault();
    let query = event.target.value;
    // console.log(query);
    this.props.searchUsers(query);
  };

  render() {
    // console.log(this.state);

    return (
      <div>
        {/* <label className="label">Find users: </label> */}
        <div className="control">
          <input
            onChange={this.handleChange}
            type="text"
            // className="form-control"
            className="input search-bar form-control"
            name="query"
            placeholder="Add members"
            value={this.state.name}
          />
        </div>
      </div>
    );
  }
}

export default UserSearch;
