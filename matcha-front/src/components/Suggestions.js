import React from 'react';
import '../../css/RightMenuProfile.css';
import { Link } from 'react-router';

class Suggestions extends React.Component {
	state = {
		loggedUser: null,
	}

	componentWillMount() {
		this.setState({ loggedUser: this.props.loggedUser })
	};

	render() {
		const { user } = this.props;
		return (
			<div className="RightMenuProfile">
				<span> You may also like </span>
				{
				user.map((src, key) => {
					if((src.isBlocked.indexOf(this.state.loggedUser.username) === -1)
						&& (src.blocked.indexOf(this.state.loggedUser.username === -1)
						&& (this.state.loggedUser.isBlocked.indexOf(src.username) === -1)
						&& (this.state.loggedUser.blocked.indexOf(src.username) === -1)
						 && (src.distance < 10000)))
						 {
					return (
						<div key={key} className="suggestions">
						<Link className='suggestionsLink' to={`/matcha/profile/${src.username}`}>
						{ <p> {src.username} </p> }
						{((src.image.length > 0) &&
							 <img role="presentation" width="150px" height="150px" src={"http://localhost:8080/public/" + src.image[0]}/>) ||
						(src.gender === 'male' &&
							<img role="presentation" width="150px" height="150px" src={require("../../data/photos/andrew.png")}/>) ||
						(src.gender === 'female' &&
							<img role="presentation" width="150px" height="150px" src={require("../../data/photos/girl.png")}/>)
					 }
						</Link>
						 </div>
					)
				}
				return <div key={key}></div>
				})
			} </div>
		)
	}
}

export default Suggestions;
