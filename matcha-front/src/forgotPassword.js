import React from 'react';
import '../css/style.css';
import { browserHistory } from 'react-router';
import InputMatch from './components/Input';
import ErrorMessage from './components/error';
import axios from 'axios';

class ForgotPassword extends React.Component {
	state = {
		mail: null,
	}
	forgotPassword = async (e) => {
		e.preventDefault();
		if (e.target.mail.value.length > 30) {
			e.target.mail.value = '';
			this.setState({ mail: 'invalid entry' });
		}
		const response = await axios({
			method: 'post',
			url: 'http://localhost:8080/forgot',
			data: {
				mail: e.target.mail.value,
			}
		});
		if(response.data.status === false) {
			this.setState({ mail: 'mail doesnt exist' });
		} else {
			browserHistory.push('resetpassword');
		}
	};

	render() {
		const {
			mail,
		} = this.state;
		return (
			<div className='checkEmail'>
				<form  className="checkEmail1" onSubmit={this.forgotPassword}>
					<h1>Please enter your mail address</h1>
						<InputMatch
							name="mail"
							type="text"
							label="Mail adress"
						>
							<ErrorMessage>{mail}</ErrorMessage>
						</InputMatch>

							<input type="submit" value="Send mail" />
				</form>
			</div>
		)
	};
}

export default ForgotPassword;
