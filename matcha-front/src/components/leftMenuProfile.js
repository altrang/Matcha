import React from 'react';
import '../../css/leftMenuProfile.css';
import * as ProfileComps from './ProfileComps.js';
import axios from 'axios';

class LeftMenuProfile extends React.Component {
	state = {
		loggedUser: false,
		liked: false,
		blocked: false,
		loggedUser1: null,
		reportUsername: null,
		enabled: ''
	}
	blocked = async (e) => {
		e.preventDefault();
		this.setState({ enabled: 'disabled' });
		const response = await axios({
			method: 'put',
			url: 'http://localhost:8080/blocked',
			headers: {
				logToken: localStorage.getItem('logToken'),
			},
			data: {
				username: this.props.data.username,
			}
		});
		if (response.data.details === 'blocked') {
			this.setState({ blocked: true, enabled: '' });
		} else if (response.data.details === 'unblocked') {
			this.setState({ blocked: false, enabled: '' });
		}
	};

	like = async (e) => {
		e.preventDefault();
		this.setState({ enabled: 'disabled' });
		const response = await axios({
			method: 'put',
			url: 'http://localhost:8080/liked',
			headers: {
				logToken: localStorage.getItem('logToken'),
			},
			data: {
				username: this.props.data.username,
			},
		});
		if (response.data.details === 'unliked') {
			this.setState({ enabled: '' });
			this.props.updateLike(false);
		} else if (response.data.details === 'liked') {
			this.setState({ enabled: '' });
			this.props.updateLike(true);
		}
	}
	report = async (e) => {
		this.setState({ enabled: 'disabled' });
		axios({
			method: 'post',
			url: 'http://localhost:8080/reportUser',
			data: {
				username: this.state.reportUsername,
			},
			headers: {
				logToken: localStorage.getItem('logToken'),
			}
		}).then(() => {
			this.setState({ enabled: '' });
		});
	};

	componentWillMount() {
		const { selfReq, alreadyLiked, alreadyBlocked } = this.props.data;
		const { loggedUser1 } = this.props;
		this.setState({ reportUsername: this.props.data.username });
		this.setState({ loggedUser: selfReq, liked: alreadyLiked, blocked: alreadyBlocked, loggedUser1: loggedUser1 });
	}

	componentWillReceiveProps = (newProps) => {
		const { selfReq, alreadyLiked, alreadyBlocked } = newProps.data;
		const { loggedUser1 } = newProps;
		this.setState({ reportUsername: newProps.data.username });
		this.setState({ loggedUser: selfReq, liked: alreadyLiked, blocked: alreadyBlocked, loggedUser1: loggedUser1 });
	}

	changeCenter1 = (e) => {
		e.preventDefault();
		this.props.setCenter(<ProfileComps.ProfileCompInfos data={this.props.data} data2={this.props.loggedUser1} />);
	}
	changeCenter2 = (e) => {
		e.preventDefault();
		this.props.setCenter(<ProfileComps.ProfileCompPhotos data={this.props.data} data2={this.props.data2} />);
	}
	changeCenter3 = (e) => {
		e.preventDefault();
		this.props.setCenter(<ProfileComps.ProfileCompBio data={this.props.data} data2={this.props.data2}/>);
	}
	render() {
		const { username, image, gender } = this.props.data;
		return (
			<div className="leftStart">
				{((image.length > 0) &&
					<div className="leftMenuPhoto">
						<img role="presentation" width="150px" height="150px" src={"http://localhost:8080/public/" + image[0]}/>
					</div>) ||
				(gender === 'male' &&
					<div className="leftMenuNoPhoto">
						<img role="presentation" width="150px" height="150px" src={require("../../data/photos/andrew.png")}/>
					</div>) ||
				(gender === 'female' &&
					<div className="leftMenuNoPhoto">
						<img role="presentation" width="150px" height="150px" src={require("../../data/photos/girl.png")}/>
					</div>)
				}
				 <div className="leftMenuName"><span>{username}</span></div>
				 <button className="leftMenuButton" onClick={this.changeCenter1}>Infos</button><br /><br />
				 <button className="leftMenuButton" onClick={this.changeCenter2}>Photos</button><br /><br />
				 <button className="leftMenuButton" onClick={this.changeCenter3}>Bio And Tags</button><br /><br />
				 {((this.state.loggedUser === false && this.state.loggedUser1.image.length > 0 ) && <button type="submit" disabled={this.state.enabled} className="leftMenuButton LikeButton" onClick={this.like}>
				 {((this.state.liked === false) && <img src={require("../../data/photos/like.png")} width="90" height="50" alt="submit" />) ||
				 ((this.state.liked === true) && <img src={require("../../data/photos/dislike.png")} width="90" height="50" alt="submit" />)}
				 </button>)}
				 <br /><br />
				 {((this.state.loggedUser === false) &&
					 (this.state.blocked === false) && <button className="leftMenuButton" disabled={this.state.enabled} onClick={this.blocked}>Block this user</button>) ||
					 ((this.state.loggedUser === false) &&
						 (this.state.blocked === true) && <button className="leftMenuButton" disabled={this.state.enabled} onClick={this.blocked}>Unblock this user</button>)}
				<br /><br />
				{((this.state.loggedUser === false) && <button className="leftMenuButton" disabled={this.state.enabled} onClick={this.report}>Report This User</button>)}
				<br /><br />
			</div>
		)
	}
}

export default LeftMenuProfile;
