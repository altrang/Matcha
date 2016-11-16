import React from 'react';
import '../css/style.css';
import { Link } from 'react-router';
import axios from 'axios';
import { browserHistory } from 'react-router';

class Accueil extends React.Component {
	_mounted = false;
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

	componentWillUnmount() {
		this._mounted = false;
	};

	render () {
		return (
		<div className="olivier">
			<div className="button">
			<Link className="myButton myButton2" to="createUser">CREATE ACCOUNT</Link>
			<Link className="myButton myButton1" to="login">LOGIN</Link>
			</div>
		</div>
		);
};
}

export default Accueil;
