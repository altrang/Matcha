
import React from 'react';
import '../css/style.css';
import axios from 'axios';

class Notification extends React.Component {

	_mounted = false;

	state = {
		notifications: null,
		username: null,
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
			axios({
				method: 'post',
				url: 'http://localhost:8080/getNotif',
				data: data.loggedUser,
			}).then((response) => {
				if (!this._mounted) return (false);
				this.setState({ notifications: response.data.alreadyLiked.notifications, username: response.data.alreadyLiked.username });
			})
		})
	}

	componentDidMount() {
		this._mounted = true;
	};

	componentWillUnmount() {
		this._mounted = false;
	};

	deleteNotif = (key, src) => {
		axios({
			method: 'post',
			url: 'http://localhost:8080/deleteNotif',
			data: {
				username: this.state.username,
				notif: src,
				key: key,
			}
		}).then(({data}) => {
			if (!this._mounted) return (false);
			if (data.notification)
			this.setState({ notifications: data.notification });
			else {
				this.setState({ notifications: 'aucune notifications' });
			}
		});
	};

	render() {
		return (
			<div className="notifPage">
			<div>
				{(this.state.notifications && this.state.notifications.map((src, key) => <div className="notificationDisplay" key={key} onClick={(e) => this.deleteNotif(key, src)}><li>{src}</li></div>)) ||
			<div></div>}
			</div>
			</div>
		)
	}
}

export default Notification;
