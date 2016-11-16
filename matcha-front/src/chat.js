import React from 'react';
import axios from 'axios';
import _ from 'lodash';

class Chat extends React.Component {

	_mounted = false;

	state = {
		socket: null,
		loggedUser: null,
		chatRoom: null,
		recipient: null,
		messages: [],
		display: false,
	}
	componentWillMount() {
		this.socket = global.socket;
		axios({
			method: 'put',
			url: 'http://localhost:8080/checkuser',
			headers: {
				logToken: localStorage.getItem('logToken')
			}
		}).then(({data}) => {
			if (!this._mounted) return (false);
			this.setState({ loggedUser: data.loggedUser })
			this.socket.removeListener('receiveMess');
			this.socket.on('receiveMess', ({ sender, message }) => {
				const newChat = this.state.messages;
				newChat.push({ author: sender, message: message });
				const displays = _.takeRight(newChat, 20);
				this.setState({ messages: displays });
			});
			axios({
				method: 'put',
				url: 'http://localhost:8080/getchat',
				data: {
					username: data.loggedUser.username,
				}
			}).then(({data}) => {
				if (!this._mounted) return (false);
				this.setState({ chatRoom: data.chatsRoom.map((room) => room.user), rooms: data.chatsRoom });
			});
		});
	}
	componentWillUnmount() {
		this._mounted = false;
	};

	displayChat = (e) => {
		e.preventDefault();
		const displays = _.takeRight(this.state.rooms[e.target.id].messages, 20);
		this.setState({ messages: displays, display: true, recipient: this.state.rooms[e.target.id].user })
	};

	sendMessage = (e) => {
		e.preventDefault();
		if (e.target.message.value === "" || !e.target.message.value.match(/[a-zA-Z0-9?!@#$%*'"=]/)) return (false);
		this.socket.emit('sendMess', { recipient: this.state.recipient, message: e.target.message.value });
		const newChat = this.state.messages;
		newChat.push({ author: this.state.loggedUser.username, message: e.target.message.value });
		const displays = _.takeRight(newChat, 20);
		this.setState({ messages: displays });
		e.target.message.value = "";
	}

	componentDidMount() {
		this._mounted = true;
	};

	render() {
		const messages = this.state.messages.map((el, key) =>
		<li
			className={`chatDisplay ${el.author === this.state.loggedUser.username ? 'chatMe' : 'chatOther' }`}
			key={key}>
			{el.message}
		</li>)
		const chatRoom = this.state.chatRoom ? this.state.chatRoom.map((el, key) => <li onClick={this.displayChat} id={key} key={key}> {el} </li>) : <div>aucun chat disponible</div>
		return (
			<div className="chatWindow">
				{this.state.chatRoom && <ul> {chatRoom}</ul>}
				{this.state.display && <div className="chatss">
				<ul className="messageList">
				{messages}
				</ul>
				<form className="chatButton" onSubmit={this.sendMessage}>
					<input type="text"  name="message" autoComplete="off"  />
					<input type="submit" value="send message" />
				</form>
				</div>}
			</div>
		)
	}
}

export default Chat;
