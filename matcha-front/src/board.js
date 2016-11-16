import React from 'react';
import axios from 'axios';
import '../css/style.css';
import { browserHistory } from 'react-router';
import SuggestionsDisplay from './components/SuggestionsDisplay';

class Board extends React.Component {
	_mounted = false;

	state = {
		username: '',
		pending: true,
		users: null,
		loggedUser: null,
	}

	getData = () => {
		axios({
			method: 'put',
			url: 'http://localhost:8080/checkuser',
			headers: {
				logToken: localStorage.getItem('logToken')
			}
		}).then(({data}) => {
			if (this._mounted);
			if (data.status === false) {
				browserHistory.push('/');
				return(<div> Loading </div>)
			}
		})
	};

	componentWillMount() {
		this.getData();
	}
	componentDidMount() {
		this._mounted = true;
		axios({
		   method: 'post',
		   url: 'http://localhost:8080/fullsearch',
		   headers: {
			   logToken: localStorage.getItem('logToken'),
		   }
	   }).then(({data}) => {
		   if (!this._mounted) return (false);
		   if (data) {
			   this.setState({ users: data.listUser, loggedUser: data.loggedUser });
		   }
		   else {
			   browserHistory.push('login');
		   }
	   });
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	render() {
		return (
			<div>
				<SuggestionsDisplay data={this.state.users} data1={this.state.loggedUser}/>
			</div>
		)
	}
}

export default Board;
