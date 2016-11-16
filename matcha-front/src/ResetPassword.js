import React from 'react';
import axios from 'axios';
import '../css/style.css';
import { browserHistory } from 'react-router';
import ErrorMessage from './components/error';
import '../css/inputMatch.css';
import InputMatch from './components/Input';

class ResetPassword extends React.Component {
		state = {
			username: null,
			resetKey: null,
			password: null,
			passSame: null,
		}

		resetPassword = async (e) => {
			e.preventDefault();
			e.persist();
			if(e.target.password.value.length > 30 || e.target.username.value.length > 30 || e.target.code.value.length > 30) {
				e.target.password.value = '';
				e.target.username.value = '';
				e.target.code.value = '';
				this.setState({ serverResponse: 'invalid entry' });
			}
			this.setState({
				username: null,
				resetKey: null,
				password: null,
				passSame: null,
			})
			if (e.target.password.value !== e.target.password1.value) {
				this.setState({ passSame: 'Password dont match', subValue: 'Try Again' });
				return (false);
			}
			const response = await axios({
				method: 'post',
				url: 'http://localhost:8080/resetpassword',
				data: {
					username: e.target.username.value,
					resetKey: e.target.code.value,
					password: e.target.password.value,
				}
			});
			if (response.data.status === false) {
				if (response.data.details === 'invalid request') {
					const error = {};
					response.data.error.forEach((el) => {
						error[el.path] = el.error;
					});
					this.setState({ ...error });
				} else {
					this.setState({ serverResponse: response.data.details });
				}
			} else {
				browserHistory.push('login');
			}
		};
	render () {
		const {
			username,
			password,
			resetKey,
			passSame,
			serverResponse,
		} = this.state;
		return (
			<div className="resetPassword">
				<form onSubmit={this.resetPassword} className="resetPassword1">
				<h1> Reset your password </h1>
				<div>{serverResponse}</div>
				<div className="passError"></div>
					<InputMatch
						name="username"
						type="text"
						label="Username"
					>
						<ErrorMessage>{username}</ErrorMessage>
					</InputMatch>
					<InputMatch
						name="code"
						type="text"
						label="Code"
					>
						<ErrorMessage>{resetKey}</ErrorMessage>
					</InputMatch>
					<InputMatch
						name="password"
						type="password"
						label="Password"
					>
						<ErrorMessage>{password}</ErrorMessage>
					</InputMatch>
					<InputMatch
						name="password1"
						type="password"
						label="Verify your password"
					>
						<ErrorMessage>{passSame}</ErrorMessage>
					</InputMatch>
					<input className="inputSubmit" type="submit" value="Reset Password"/>
				</form>
			</div>
		)
	}
}

export default ResetPassword;
