import React from 'react';
import { Link } from 'react-router';
import '../../css/SuggestionsDisplay.css';


class SuggestionsDisplay extends React.Component {
	state = {
		users: null,
		ageButton: false,
		popButton: false,
		distButton: false,
		loggedUser: null,
		tagsButton: false,
	}

	componentWillReceiveProps = (newProps) => {
		this.setState({ users: newProps.data, loggedUser: newProps.data1 });
	};

	sortAge = (e) => {
		const newUSers = this.state.users.sort((a,b) => {
			if (this.state.ageButton)
				return (a.age - b.age);
			else {
				return (-a.age - -b.age);
			}
		});
		this.setState({ users: newUSers, ageButton: !this.state.ageButton });
		return(false);
	};

	sortPop = (e) => {
		const newUSers = this.state.users.sort((a,b) => {
			if (this.state.popButton)
				return (a.popCount - b.popCount);
			else {
				return (-a.popCount - -b.popCount);
			}
		});
		this.setState({ users: newUSers, popButton: !this.state.popButton });
		return(false);
	};

	sortDistance = (e) => {
		const newUSers = this.state.users.sort((a,b) => {
			if (this.state.distButton)
				return (a.distance - b.distance);
			else {
				return (-a.distance - -b.distance);
			}
		});
		this.setState({ users: newUSers, distButton: !this.state.distButton });
		return(false);
	};

	sortTags = (e) => {
		const sorted = this.state.users.sort((userA, userB) => {
			if (this.state.tagsButton) {
				return (+userA.commonTags.length - +userB.commonTags.length);
			} else {
				return (-userA.commonTags.length - -userB.commonTags.length);
			}
		});
		this.setState({ users: sorted, tagsButton: !this.state.tagsButton });
		return(false);
}

	render() {
		const { users } = this.state;
		if (!this.state.users) return (<div>LOADING.............</div>)
		return (
			<div className="board">
				<span> People you may like ! </span>
				<div className="suggestionsDisplay">
				<button className="sortButton" onClick={this.sortAge}>sort by age</button>
				<button className="sortButton" onClick={this.sortPop}>sort by Popularity</button>
				<button className="sortButton" onClick={this.sortDistance}>sort by distance</button>
				<button className="sortButton" onClick={this.sortTags}>sort by tags</button>
				<div className="sugg">
				{
				users.map((src, key) => {
					if ((src.isBlocked.indexOf(this.state.loggedUser.username) === -1)
						&& (src.blocked.indexOf(this.state.loggedUser.username === -1)
						&& (this.state.loggedUser.isBlocked.indexOf(src.username) === -1)
						&& (this.state.loggedUser.blocked.indexOf(src.username) === -1)
					 && (src.distance < 2000)))
						{
					return (
						<div key={key} className="userSearch">
						<Link className='suggestionsLink' to={`/matcha/profile/${src.username}`}>
						{ <p> {src.username} </p> }
						{((src.image.length > 0) &&
							 <img className="suggestionsImg" role="presentation" src={"http://localhost:8080/public/" + src.image[0]}/>) ||
						(src.gender === 'male' &&
							<img className="suggestionsImg" role="presentation" src={require("../../data/photos/andrew.png")}/>) ||
						(src.gender === 'female' &&
							<img className="suggestionsImg" role="presentation" src={require("../../data/photos/girl.png")}/>)
					 	}
						{ <p> Age: {src.age} </p> }
						{ <p> Pop: {src.popCount} </p> }
						{ <p> Distance: {src.distance} </p> }
						{ <p> CommonTags: {src.commonTags.length } </p> }
						{ <p> MatchPoint: {src.suggestPoint } </p> }
						</Link>
						</div>
					)
				}
				return (false);
				})
			}
			</div>
			</div>
			</div>
		)
	};
}

export default SuggestionsDisplay;
