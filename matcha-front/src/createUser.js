import React from 'react';
import '../css/style.css';
import axios from 'axios';
import { browserHistory } from 'react-router';
import ErrorMessage from './components/error';
import InputMatch from './components/Input';
import DateInput from './components/DateInput';
import RadioInput from './components/RadioInput';

class createUser extends React.Component {
	_mounted = false;

	defaultState = {
		subValue: 'Register',
		error: null,
		mailInval: null,
		passSame: null,
		backColor: 'red',
		mailexists: null,
		username: null,
		email: null,
		lastname: null,
		firstname: null,
		password: null,
		birthdate: null,
		ipAddress: null,
		location: {}
	};

	componentDidMount() {
		this._mounted = true;
	}
	componentWillMount() {
		axios({
			method: 'put',
			url: 'http://localhost:8080/checkUser',
			headers: {
				logToken: localStorage.getItem('logToken'),
			}
		}).then(({data}) => {
			if (!this._mounted) return (false);
			if (data.status === true) {
				browserHistory.push('/matcha/board');
				return(<div> Loading </div>)
			}
		}).then(() => {
			if (!this._mounted) return (false);
			axios({
				method: 'get',
				url: 'http://jsonip.com/',
			}).then(({ data }) => {
				if (!this._mounted) return (false);
				this.setState({ ipAddress: data.ip });
				axios({
					method: 'get',
					url: `http://ip-api.com/json/${this.state.ipAddress}`,
				}).then(({ data }) => {
					if (!this._mounted) return (false);
					this.setState({ location: {
						lat: data.lat,
						lon: data.lon,
						address: data.city,
					}});
				})
			})
		});
	}

	componentWillUnmount() {
		this._mounted = false;
	};

	state = {
		...this.defaultState,
	}

	createUser = async (e) => {
		e.preventDefault();
		e.persist();
		if (e.target.username.value.length > 30 ||
			e.target.password.value.length > 30 ||
			e.target.lastname.value.length > 30 ||
			e.target.firstname.value.length > 30 ||
			e.target.mail.value.length > 30) {
				e.target.username.value = '';
				e.target.password.value = '';
				e.target.lastname.value = '';
				e.target.firstname.value = '';
				e.target.mail.value = '';
			}
		this.setState ({
			username: null,
			firstname: null,
			lastname: null,
			password: null,
			mail: null,
			passSame: null,
			birthdate: null,
			gender: null,
		});
		if (e.target.password.value !== e.target.password1.value) {
			this.setState({ passSame: 'Password dont match', subValue: 'Try Again' });
			return (false);
		}
		const location = this.state.location;
		const day = e.target.day.value < 10 ? `0${e.target.day.value}` : e.target.day.value;
		const birthdate = `${e.target.month.value}-${day}-${e.target.year.value}`;
		const response = await axios({
			method: 'post',
			url: 'http://localhost:8080/add',
			data: {
				username: e.target.username.value,
				password: e.target.password.value,
				lastname: e.target.lastname.value,
				firstname: e.target.firstname.value,
				mail: e.target.mail.value,
				gender: e.target.gender.value,
				birthdate,
				location,
			}
		});
		if (response.data.status === false) {
			if (response.data.details === 'invalid entry') {
				const error = {};
				response.data.error.forEach((el) => {
					error[el.path] = el.error;
				});
				this.setState({ ...error });
			} else this.setState({ serverResponse: response.data.details });
		} else {
			browserHistory.push('login');
		}
	};

	render () {
		const {
			username,
			firstname,
			lastname,
			password,
			mail,
			passSame,
			birthdate,
			gender,
			serverResponse,
		} = this.state;

		return (
			<div className="login">
				<form onSubmit={this.createUser} className="createUser">
					<h1> Create User </h1>
					<div className='logError'>{serverResponse}</div>
						<InputMatch
							name="username"
							type="text"
							label="Username"
							>
							<ErrorMessage>{username}</ErrorMessage>
						</InputMatch>
						<InputMatch
							name="firstname"
							type="text"
							label="Firstname"
							>
							<ErrorMessage>{firstname}</ErrorMessage>
						</InputMatch>
						<InputMatch
							name="lastname"
							type="text"
							label="Lastname"
							>
							<ErrorMessage>{lastname}</ErrorMessage>
						</InputMatch>
						<InputMatch
							name="mail"
							type="email"
							label="Email"
							>
							<ErrorMessage>{mail}</ErrorMessage>
						</InputMatch>
						<RadioInput label="Gender" name="gender" value1="female" value2="male">
		                    <ErrorMessage>{gender}</ErrorMessage>
		                </RadioInput>
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
							label="Verify Password"
							>
							<ErrorMessage>{passSame}</ErrorMessage>
							</InputMatch>
						<DateInput label="Birthdate">
							<ErrorMessage>{birthdate}</ErrorMessage>
						</DateInput>
						<div className="createButtonDiv">
						<input className="createButton" type="submit" value={this.state.subValue} />
						</div>
				</form>
			</div>
		)
	};
}

export default createUser;
