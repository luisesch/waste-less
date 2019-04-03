import React, { Component } from "react";
import tasks from "../../tasks.json";
import Search from "./TaskSearch";
import Category from "./CategorySearch";
import Popup from "reactjs-popup";
import "./Tasks.css";
import { Link } from "react-router-dom";

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
    if (query === "All categories") {
      this.setState({ filtered: tasks });
    } else {
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
    let task = tasks.find(task => task.id === taskId);
    let points = Number(task.points);
    this.props.setScore(points, JSON.stringify(task));
  };

  render() {
    return (
      <div className="tasks p-5">
        <h1 className="font-weight-light Quicksand">Tasks</h1>
        <hr className="w-75" />
        <h4 className="mb-5">What else can you do to rise your score today?</h4>

        <div className="container-fluid">
          <div className="row noborder">
            <div className="col-md-6">
              <Search searchTasks={this.searchNameHandler} />
            </div>
            <div className="col-md-6">
              <Category searchCategory={this.searchCategoryHandler} />
            </div>
          </div>
          <div className="row noborder">
            {this.state.filtered.map((task, index) => {
              return (
                <div key={index} className="col-xs-12 col-md-4 mt-3">
                  <div className="card" key={index}>
                    <div className="card-body font-weight-light">
                      <img
                        src={task.photo}
                        className="card-img-top img-thumbnail"
                        alt="default"
                      />
                      <h5 className="card-title">{task.description}</h5>
                      <div className="row">
                        <div className="col-6">
                          {this.props.userInSession.league.confirmed ? (
                            <button
                              className="points mx-2 btn btn-secondary"
                              type="submit"
                              value={task.id}
                              onClick={this.scoreHandler}
                            >
                              {task.points}
                            </button>
                          ) : (
                            <Popup
                              trigger={
                                <button
                                  className="points mx-2 btn btn-secondary"
                                  value={task.id}
                                >
                                  {task.points}
                                </button>
                              }
                              position="right center"
                            >
                              <div>
                                Ready to collect some points? You're not
                                currently a league, create one{" "}
                                <Link to="/myleague">here</Link>
                              </div>
                            </Popup>
                          )}
                        </div>
                        {/* only show popup, if task includes additional information */}
                        <div className="col-6">
                          {task.popup && (
                            <Popup
                              trigger={
                                <button
                                  className="btn btn-secondary"
                                  type="button"
                                >
                                  info
                                </button>
                              }
                              position="right center"
                            >
                              <div>{task.popup}</div>
                            </Popup>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="card-footer text-muted">
                      {task.category}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Tasks;
