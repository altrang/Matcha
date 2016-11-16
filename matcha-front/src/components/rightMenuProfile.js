import React from 'react';
// import '../../css/rightMenuProfile.css';
import axios from 'axios';
import Suggestions from './Suggestions';

class RightMenuProfile extends React.Component {
	_mounted = false;

	state = {
		user: null,
		username: this.props.username,
		loggedUser: null,
	}

	getData = () => {
		axios({
			method: 'post',
			url: 'http://localhost:8080/fastsearch',
			data: {
				username: this.props.username,
			},
			headers: {
				logToken: localStorage.getItem('logToken')
			}
		}).then(({ data }) => {
			if(!this._mounted) return (false);
			this.setState({ user: data.listUser, loggedUser: data.loggedUser });
		})
	}
	componentDidMount() {
		this._mounted = true;
	};

	componentWillUnmount() {
		this._mounted = false;
	};

	componentWillMount() {
		this.getData();
	}

	componentWillReceiveProps = (newProps) => {
		this.getData();
	};

	render() {
		if (!this.state.user || !this.state.user.length) return (<div>Nothing to Suggest</div>)
		return (
			<div>
				{this.state.user[0].image && (<Suggestions user={this.state.user} loggedUser={this.state.loggedUser} />)}
			</div>
		)
	}
}

export default RightMenuProfile;
