import React, { Component } from 'react';
import AuthService from './auth-service';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './Home.css';

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = { username: '', password: '' };
		this.service = new AuthService();
	}

	handleFormSubmit = (event) => {
		event.preventDefault();
		const username = this.state.username;
		const password = this.state.password;
		this.service
			.login(username, password)
			.then((response) => {
				this.setState({ username: '', password: '' });
				this.props.getUser(response);
				// this.props.history.push("/profile");
      })
      .catch(error => console.log(error));
  };


	handleChange = (event) => {
		const { name, value } = event.target;
		this.setState({ [name]: value });
	};

	render() {
		return (
			<div className="Home">
				<div className="row min-vh-100">
					<div className="leftBar col-7">
						<br />
						<br />
						<br />
						<label className="text-center font-weight-bold" htmlFor="exampleCheck1">
							<h1 className="Header"> Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy</h1>
						</label>
					</div>
					<div className="rightBar col-5">
						<br />
						<br />
						<h3 className="fontForm">Login with your account</h3>
							
						<br />
						<br />

						<form onSubmit={this.handleFormSubmit}>
							<div className="form-group">
								<input
									type="text"
									name="username"
									value={this.state.username}
									onChange={(e) => this.handleChange(e)}
									className="form-control"
									id="exampleInputEmail1"
									aria-describedby="emailHelp"
									placeholder="Username"
								/>

								<small id="emailHelp" className="form-text text-muted">
									We'll never share your email with anyone else.
								</small>
							</div>

							<div className="form-group">
								<input
									type="password"
									className="form-control"
									name="password"
									value={this.state.password}
									onChange={(e) => this.handleChange(e)}
									id="exampleInputPassword1"
									placeholder="Password"
								/>
							</div>

							<div className="form-group form-check">
								<input type="checkbox" className="form-check-input" id="exampleCheck1" />
								<label className="form-check-label" htmlFor="exampleCheck1">
									I accept the terms of use and privacy statement{' '}
								</label>
							</div>

							<button type="submit" className="btn btn-primary" value="Login">
								Submit
							</button>
							<br />
							<br />
						</form>
						<p>
							You don't have an account?
							<Link to={'/signup'}> Sign up</Link> here
						</p>
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
