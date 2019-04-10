import React, { Component } from "react";
import tasks from "../../tasks.json";
import Search from "./TaskSearch";
import Category from "./CategorySearch";
import Popup from "reactjs-popup";
import "./Tasks.css";
import { Link } from "react-router-dom";
import AuthService from "../auth/auth-service.js";
import TaskService from "./task-service.js";

// import { Link } from "react-router-dom";

class Tasks extends Component {
  constructor() {
    super(); //this runs React Component's constructor
    this.state = {
      tasks: tasks,
      filtered: tasks,
      loggedInUser: {},
      mounted: false
    };
    this.authService = new AuthService();
    this.taskService = new TaskService();
  }

  componentDidMount() {
    // get logged in user and add to state
    this.authService
      .loggedin()
      .then(response => {
        this.setState({
          loggedInUser: response,
          mounted: true
        });
      })
      .catch(err => console.log(err));
  }

  searchNameHandler = query => {
    let filteredTasks = this.state.tasks.filter(task => {
      const taskLowerCase = task.description.toLowerCase();
      const filter = query.toLowerCase();
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

  raiseScore = event => {
    event.preventDefault();
    const taskId = event.target.value;
    let task = tasks.find(task => task.id === taskId);
    let points = Number(task.points);
    let newScore = this.state.loggedInUser.score + points;
    this.taskService
      .taskCompleted(newScore, this.state.loggedInUser, JSON.stringify(task))
      .then(response => {
        this.setState({
          loggedInUser: response
        });
      })
      .catch(err => console.log(err));
  };

  render() {
    if (Object.entries(this.state.loggedInUser).length === 0) {
      return <p>Loading...</p>;
    } else {
      return (
        <div className="tasks px-5 pb-5 pt-1">
          <div className="text-right">
            <button className="btn btn-light">
              Your score: {this.state.loggedInUser.score}
            </button>
          </div>
          <h1 className="font-weight-light Quicksand">Tasks</h1>
          <hr className="w-75" />
          <h4 className="mb-5">
            What else can you do to raise your score today?
          </h4>

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
                  <div key={index} className="col-xs-12 col-md-4  mt-3">
                    <div className="card" key={index}>
                      <div className="card-body font-weight-light">
                        <img
                          src={task.photo}
                          className="card-img-top img-thumbnail"
                          alt="default"
                        />
                        <h5 className="card-title">{task.description}</h5>

                        {this.state.loggedInUser.league.confirmed ? (
                          <button
                            className="points btn btn-lg Home-btn"
                            type="submit"
                            value={task.id}
                            onClick={this.raiseScore}
                          >
                            {task.points}
                          </button>
                        ) : (
                          <Popup
                            trigger={
                              <button
                                className="points mx-2 btn btn-lg Home-btn"
                                value={task.id}
                              >
                                {task.points}
                              </button>
                            }
                            position="right center"
                          >
                            <div>
                              Ready to collect some points? You're not currently
                              in a league, create one{" "}
                              <Link
                                to="/myleague"
                                style={{
                                  textDecoration: "underline",
                                  color: "#1b2f33"
                                }}
                              >
                                here
                              </Link>
                            </div>
                          </Popup>
                        )}

                        {/* only show popup, if task includes additional information */}
                      </div>
                      <div className="card-footer text-muted container-fluid">
                        <div className="row noborder">
                          <div className="col-10">{task.category}</div>
                          <div className="col-2 text-left px-0">
                            {task.popup && (
                              <Popup
                                trigger={
                                  <img
                                    src="/images/info_icon.png"
                                    alt="info icon"
                                    className="info-icon img-fluid"
                                  />
                                }
                                position="top center"
                              >
                                <div>{task.popup}</div>
                              </Popup>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="col-xs-12 col-md-4  mt-3">
                <div className="card">
                  <div className="card-body font-weight-light">
                    <img
                      src="/images/question_mark.png"
                      className=" blue add-task"
                      alt="default"
                    />
                    <h5 className="card-title">Missing a task?</h5>
                    <Link to="/contact">
                      <button className="points mx-2 btn Home-btn">
                        Let us know
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="card-footer text-muted">Thanks :)</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Tasks;
