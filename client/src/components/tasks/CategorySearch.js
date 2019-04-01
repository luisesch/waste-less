import React, { Component } from "react";

class Category extends Component {
  constructor() {
    super(); //this runs React Component's constructor

    this.state = {
      query: ""
    };
  }

  handleChange = event => {
    event.preventDefault();
    let query = event.target.value;
    this.props.searchCategory(query);
  };

  render() {
    // console.log(this.state);

    return (

		
<form>
  <div className="form-row">
    <select 
    className="form-control" 
    id="exampleFormControlSelect1"
    onChange={this.handleChange}
    type="text"
    name="query"
    placeholder="Find task by Category"
    value={this.state.category}
    >
      <option>All categories</option>
      <option>To Go</option>
      <option>Kitchen</option>
      <option>Bathroom</option>
      <option>Shopping</option>
      <option>Other</option>
     
    </select>
  </div>
  </form>

    );
  }
}

export default Category;

