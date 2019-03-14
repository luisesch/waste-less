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
    this.props.searchUsers(query);
  };

  render() {
    // console.log(this.state);

    return (
      <div>
        <label className="label">Find users: </label>
        <div className="control">
          <input
            onChange={this.handleChange}
            type="text"
            className="input search-bar"
            name="query"
            placeholder="Find friends"
            value={this.state.name}
          />
        </div>
      </div>
    );
  }
}

export default UserSearch;
