import React from 'react';
import { browserHistory } from 'react-router';
import axios from 'axios';

class Logout extends React.Component {
	_mounted = false;

	componentWillMount() {
		axios({
			method: 'put',
			url: 'http://localhost:8080/logout',
			headers: {
				logToken: localStorage.getItem('logToken'),
			}
		}).then(({data}) => {
			if (!this._mounted) return (false);
			global.socket.disconnect();
			browserHistory.push('/login');
		});
	}

	componentDidMount() {
		this._mounted = true;
	};

	componentWillUnmount() {
		this._mounted = false;
	};

	render() {
		return (
			<div></div>
		)
	}
}

export default Logout;
