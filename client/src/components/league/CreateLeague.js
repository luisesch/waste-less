import React, { Component } from 'react';
import LeagueService from './league-service';
import UserService from '../user/user-service';
import UserSearch from '../user/UserSearch';
import AuthService from '../auth/auth-service';
import 'bootstrap/dist/css/bootstrap.css';
import './CreateLeague.css';
import api from '../../api';

class CreateLeague extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loggedInUser: null,
			name: '',
			members: [],
			users: null,
			filteredUsers: [],
			picture: null
		};
		this.leagueService = new LeagueService();
		this.userService = new UserService();
		this.authService = new AuthService();
	}

	componentDidMount() {
		this.authService
			.loggedin()
			.then((response) => {
				this.setState({
					loggedInUser: response
				});
			})
			.catch((err) => console.log(err));
		// get all users
		this.userService
			.showAll()
			.then((response) => {
				this.setState({ users: response });
			})
			.catch((err) => console.log(err));
	}

	//upload a league picture
	handleChange(e) {
		this.setState({
			file: e.target.files[0]
		});
	}
	handleSubmit(e) {
		e.preventDefault();
		api.addPicture(this.state.file, this.state.league._id);
	}

	handleChange = (event) => {
		let { name, value } = event.target;
		if (name === 'picture') {
			this.setState({ picture: event.target.files[0] });
		} else {
			this.setState({ [name]: value });
		}
	};

	membersArr = [];

	selectUser = (event) => {
		// turn string back into json
		let memberAsObject = JSON.parse(event.target.value);
		this.membersArr.push(memberAsObject);
		this.setState({ members: this.membersArr });
	};

	handleFormSubmit = (event) => {
		event.preventDefault();
		const name = this.state.name;
		const picture = this.state.picture;
		const administrator = this.state.loggedInUser._id;

		let members = [];
		this.state.members.forEach((member) => {
			members.push({ info: member._id, confirmed: false });
		});

		this.leagueService
			.create(name, administrator, members, picture)
			.then((response) => {
				this.setState({
					name: '',
					members: []
				});
				this.props.history.push('/myleague');
			})
			.catch((error) => console.log(error));
	};

	searchUserHandler = (query) => {
		if (query.length < 1) {
			this.setState({ filteredUsers: [] });
		} else {
			let filteredUsers = this.state.users.filter((user) => {
				console.log(user);
				const userLowerCase = user.username.toLowerCase();
				const filter = query;
				return userLowerCase.includes(filter);
			});
			this.setState({ filteredUsers: filteredUsers });
		}
	};

	render() {
		return (
			<div className="card">
				<div class="createLeague card-body">
					<div className="row">
						<div className="col-md-7 left">
							<img
								className="img-fluid rounded mb-4 mb-lg-0"
								src="http://www.ecozine.com/sites/default/files/imagecache/article_page_large/homemade-deliciousness.net__0.jpg"
								alt=""
							/>
						</div>
						<div className="col-md-5 right">
							<h1 className="card-title font-weight-light">Create new league </h1>
							<br />
							<div className="field">
								<form onSubmit={this.handleFormSubmit}>
									{/* <input type="file" name="picture" onChange={(e) => this.handleChange(e)} /> <br /> */}
									<div className="control">
										<input
											className="input form-control"
											type="text"
											name="name"
											onChange={this.handleChange}
											value={this.state.name}
											placeholder="Name of the league"
										/>

										<br />
									</div>
									{this.state.members.map((member, index) => {
										return (
											<div key={index}>
												<p>{member.username}</p>
											</div>
										);
									})}
									<UserSearch searchUsers={this.searchUserHandler} />
									<div className="form-check">
										{this.state.filteredUsers.map((user, index) => {
											// turn object into string
											let userAsString = JSON.stringify(user);
											return (
												<div key={index}>
													<input
														onChange={this.selectUser}
														className="form-control"
														type="checkbox"
														name="members"
														value={userAsString}
														id="user"
													/>
													<label className="form-check-label" htmlFor="user">
														{user.username}
													</label>
												</div>
											);
										})}
									</div>
									<br />
                  <label>Upload League Picture</label>
									<input type="file" name="picture" onChange={(e) => this.handleChange(e)} />

									<br />
                  <br />
									<input className="btn btn-primary" type="submit" value="Submit" />
								</form>
							</div>
						</div>
					</div>
				</div>

				<div class="card-footer text-muted">Let the games begin! </div>
			</div>
		);
	}
}

export default CreateLeague;
