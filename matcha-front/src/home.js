import React from 'react';
import { Link } from 'react-router';


class Home extends React.Component {
	render() {
		return (
			<div className="home">
				<Link className="homeButton" to="/matcha/edit">Edit Profile</Link>
				<Link className="homeButton" to="/matcha/profile">My Profile</Link>
				<Link className="homeButton" to="/matcha/search">Search</Link>
				<Link className="homeButton" to="/matcha/suggest">Suggestion</Link>
				<Link className="homeButton" to="/matcha/chat">Live Texting</Link>
				<Link className="homeButton" to="/matcha/notification">Last Notifs</Link>
			 </div>
		)
	}
}

export default Home;
