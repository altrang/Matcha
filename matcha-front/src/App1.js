import React, { Component } from 'react';
import * as Header from './header';
import io from 'socket.io-client';
import { browserHistory } from 'react-router';
import axios from 'axios';

class App1 extends Component {

	componentWillMount() {
		global.socket = io('http://localhost:8080');
		axios({
			method: 'put',
			url: 'http://localhost:8080/checkuser',
			headers: {
				logToken: localStorage.getItem('logToken')
			}
		}).then(({data}) => {
			if (data.status === false) {
				browserHistory.push('/login');
				return(<div> Loading </div>)
			}
		});
	}

	render() {
    return (
		<div className="masterr">
		<Header.Header socket={global.socket} location={this.props.location} />
      		<div className="app1">
        		{this.props.children}
      		</div>
		<Header.Footer />
  		</div>
    );
  }
}

export default App1;
