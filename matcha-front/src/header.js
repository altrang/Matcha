import React from 'react';
import '../css/style.css';
import { Link } from 'react-router';
import '../css/master.css';

class Header extends React.Component {
	state = {
		notification: '',
		socket: null,
	}

	componentWillMount() {
		this.socket = this.props.socket;
		this.socket.emit('auth', {
			logToken: localStorage.getItem('logToken'),
		})
		if (this.props.location.pathname !== '/matcha/chat') {
			this.socket.removeListener('receiveMess');
			this.socket.on('receiveMess', ({ sender }) => {
				this.setState({ notification: `${sender} sent you a message !` });
			})
		}
		this.socket.on('notification', (message) => {
			this.setState({ notification: message });
		})
	}
	componentWillReceiveProps = (newProps) => {
		if (newProps.location.pathname !== '/matcha/chat') {
			this.socket.removeListener('receiveMess');
			this.socket.on('receiveMess', ({ sender }) => {
				this.setState({ notification: `${sender} sent you a message !` });
			})
		}
	};

	delete = (e) => {
		this.setState({ notification: null });
	}

	render () {
		return (
			<div className="Header">
				<div className="notification" onClick={this.delete}>{this.state.notification}</div>
				<Link className="HeaderButton" to="/matcha/board">Home</Link>
				<Link className="HeaderButton1" to="/matcha/logout">Logout</Link>
			</div>
		)
	}
}

class Footer extends React.Component {
	render() {
		return (
			<div className="footer">atrang 2016</div>
		)
	}
}
export { Header, Footer };
