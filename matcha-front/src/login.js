import React from 'react';
import '../css/style.css';
import axios from 'axios';
import { browserHistory, Link } from 'react-router';
import '../css/inputMatch.css';
import ErrorMessage from './components/error';

import InputMatch from './components/Input';

class Login extends React.Component {

		_mounted = false;

		state = {
			subValue: 'LOGIN',
			username: null,
			password: null,
			serverResponse: null,
			enabled: '',
		}

		componentWillUnmount() {
			this._mounted = false
		};

		componentWillMount() {
			axios({
				method: 'put',
				url: 'http://localhost:8080/checkuser',
				headers: {
					logToken: localStorage.getItem('logToken')
				}
			}).then(({data}) => {
				if (!this._mounted) return (false);
				if (data.status === true) {
					browserHistory.push('/matcha/board');
					return(<div> Loading </div>)
				}
			});
		};

		componentDidMount() {
			this._mounted = true;
		};

		login = async (e) => {
			e.preventDefault();
			e.persist();
			this.setState({
				subValue: 'LOGIN',
				username: null,
				password: null,
				serverResponse: null,
				enabled: 'disabled',

			});
			if (e.target.username.value.length > 30 || e.target.password.value.length > 30) {
				e.target.username.value = '';
				e.target.password.value = '';
				this.setState({ serverResponse: 'invalid input' });
			}
			const response = await axios({
				method: 'post',
				url: 'http://localhost:8080/login',
				data: {
					username: e.target.username.value,
					password: e.target.password.value,
				},
			});
			if (response.data.status === false) {
				if(response.data.details === 'Invalid Entry') {
					const error = {};
					response.data.error.forEach((el) => {
						error[el.path] = el.error;
					});
					this.setState({ ...error, enabled: '' });
				} else {
					this.setState({ serverResponse: response.data.details, enabled: ''});
				}
			} else {
				localStorage.setItem('logToken', response.headers.logtoken);
				this.setState({ subValue: 'SUCCESS' });
				browserHistory.push('matcha/board');
			}
		}

		render () {
			const {
				username,
				password,
				serverResponse,
			} = this.state;
			return (
			<div className="login">
				<form onSubmit={this.login}>
				<div className="logError">{serverResponse}</div>
					<InputMatch
						name="username"
						type="text"
						label="USERNAME"
					>
						<ErrorMessage>{username}</ErrorMessage>
					</InputMatch>
					<InputMatch
						name="password"
						type="password"
						label="PASSWORD"
					>
						<ErrorMessage>{password}</ErrorMessage>
					</InputMatch>
					<input className="loginButton" disabled={this.state.enabled} type="submit" value={this.state.subValue}/>
					<Link className="forgotPassword" to="forgotpassword">Forgot password?</Link>
					<Link className="forgotPassword" to="createUser">Creer un compte</Link>
				</form>
			</div>
		)
		};
}


export default Login;
