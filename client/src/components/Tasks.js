import React, { Component } from "react";
import tasks from "../tasks.json";
import Search from "./Search";
// import { Link } from "react-router-dom";

class Tasks extends Component {
  constructor() {
    super(); //this runs React Component's constructor
    this.state = {
      tasks: tasks,
      filtered: tasks
    };
  }

  searchTaskHandler = query => {
    let filteredTasks = this.state.tasks.filter(task => {
      const taskLowerCase = task.description.toLowerCase();
      const filter = query;
      return taskLowerCase.includes(filter);
    });
    this.setState({ filtered: filteredTasks });
  };

  render() {
    return (
      <div>
        <h1>Tasks</h1>
        <Search searchTasks={this.searchTaskHandler} />
        <ul>
          {this.state.filtered.map((task, index) => {
            return (
              <li key={index}>
                {task.description}: {task.points}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Tasks;
