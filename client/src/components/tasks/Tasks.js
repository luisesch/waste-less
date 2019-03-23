import React, { Component } from 'react';
import tasks from '../../tasks.json';
import Search from './TaskSearch';
import Popup from 'reactjs-popup';
import 'bootstrap/dist/css/bootstrap.css';
// import { Link } from "react-router-dom";

class Tasks extends Component {
	constructor() {
		super(); //this runs React Component's constructor
		this.state = {
			tasks: tasks,
			filtered: tasks
		};
	}

	searchTaskHandler = (query) => {
		let filteredTasks = this.state.tasks.filter((task) => {
			const taskLowerCase = task.description.toLowerCase();
			const filter = query;
			return taskLowerCase.includes(filter);
		});
		this.setState({ filtered: filteredTasks });
	};

	scoreHandler = (event) => {
		let points = Number(event.target.value);
		this.props.setScore(points);
  };
  
  // modifyClassBg = category => {
  //   switch (category) {
  //     case "To do":
  //       "row bg-dark text-white";
  //       break;
  //     case "Bathroom":
  //       "row bg-dark text-white";
  //       break;
  //   }
  // };


	render() {
		return (
			<div>
				<h1>Tasks</h1>
				<Search searchTasks={this.searchTaskHandler} />
				<div className="row">
					{this.state.filtered.map((task, index) => {
						return (
							<div class="card col-xs-12 col-md-2 mb-5 mt-3 mx-3" key={index}>
								<img src="/image/default_profile.jpg" className="card-img-top" alt="default" />
								<div class="card-body h-60 font-weight-light">
									<h5 class="card-title">
										{task.description}

										<br />
										<button
											className="points mx-2 btn btn-secondary"
											type="submit"
											value={task.points}
											onClick={this.scoreHandler}
										>
											{task.points}
										</button>
									</h5>
								</div>
                <div className="row">
									<div className="card-footer text-muted">
										{task.category}
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
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}

export default Tasks;
