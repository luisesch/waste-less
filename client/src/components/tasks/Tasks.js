import React, { Component } from "react";
import tasks from "../../tasks.json";
import Search from "./TaskSearch";
import Category from "./CategorySearch";
import Popup from "reactjs-popup";
import "bootstrap/dist/css/bootstrap.css";
import "./Tasks.css";

// import { Link } from "react-router-dom";

class Tasks extends Component {
  constructor() {
    super(); //this runs React Component's constructor
    this.state = {
      tasks: tasks,
      filtered: tasks
    };
  }

  searchNameHandler = query => {
    let filteredTasks = this.state.tasks.filter(task => {
      const taskLowerCase = task.description.toLowerCase();
      const filter = query;
      return taskLowerCase.includes(filter);
    });
    this.setState({ filtered: filteredTasks });
  };

  searchCategoryHandler = query => {
if (query === "All categories") {this.setState({filtered: tasks})} 
else {

    let filteredCategory = this.state.tasks.filter(task => {
      const taskLowerCase = task.category.toLowerCase();
      const filter = query.toLowerCase();
      return taskLowerCase.includes(filter);
    });
	this.setState({ filtered: filteredCategory });
}
  };

  scoreHandler = event => {
    const taskId = event.target.value;
    let task = {};
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id === taskId) {
        task = JSON.stringify(tasks[i]);
      }
    }
    let points = Number(task.points);
    this.props.setScore(points, task);
  };

  render() {
    return (
      <div className="tasks container">
 <h1 className="font-weight-light">Tasks</h1>
 <hr></hr>
 <br/>
 <div className="row">
	<div className="col-md-6">
	<Search searchTasks={this.searchNameHandler} />
	</div>
	<div className="col-md-6">
	  <Category searchCategory={this.searchCategoryHandler} />
	  </div>
	  </div>
        <div className="row">
          {this.state.filtered.map((task, index) => {
            return (
              <div
                className="card col-xs-12 col-md-3 mb-5 mt-3 mx-3"
                key={index}
              >
                <div className="card-body font-weight-light">
                  <img
                    src={task.photo}
                    className="card-img-top img-thumbnail"
                    alt="default"
                  />
                  <br />
                  <h5 className="card-title">{task.description}</h5>
                  <button
                    className="points mx-2 btn btn-secondary"
                    type="submit"
                    value={task.id}
                    onClick={this.scoreHandler}
                  >
                    {task.points}
                  </button>
                  <Popup
                    trigger={
                      <button className="btn btn-secondary" type="button">
                        info
                      </button>
                    }
                    position="right center"
                  >
                    <div>{task.popup}</div>
                  </Popup>
                  <br /> <br />
                </div>
                <div className="card-footer text-muted">{task.category}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Tasks;
