import React, { Component } from "react";
import "./App.css";
import axios from "axios";

class App extends Component {
  constructor() {
    super();
    this.state = { test: [] };
  }

  getApi = () => {
    axios.get(`http://localhost:5000/`).then(responseFromApi => {
      console.log(responseFromApi);
      this.setState({
        test: responseFromApi.data
      });
    });
  };

  componentDidMount() {
    this.getApi();
  }

  render() {
    return (
      <div className="App">
        <p>{this.state.test.test}</p>
      </div>
    );
  }
}

export default App;
