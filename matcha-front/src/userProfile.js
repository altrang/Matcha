import React from 'react';
import axios from 'axios';
import '../css/editProfile.css';
import LeftMenuProfile from './components/leftMenuProfile';
import RightMenuProfile from './components/rightMenuProfile';
import * as ProfileComps from './components/ProfileComps';
import { browserHistory } from 'react-router';

class userProfile extends React.Component {
	_mounted = false;

	state = {
		centerComp: null,
		data: null,
		loggedUser: null,
	}

	getData = (username) => {
		axios({
			method: 'get',
			url: `http://localhost:8080/getprofile${username ? `?username=${username}` :  ''}`,
			headers: {
				logToken: localStorage.getItem('logToken'),
			}
		}).then(({data}) => {
			if (!this._mounted) return (false);
			if (data.status === 'success') {
				if (data.details === 'no username') {
					this.setState({
						data: data.askedUser,
						loggedUser: data.askedUser,
						centerComp: (<ProfileComps.ProfileCompInfos data={data.askedUser} data2={data.askedUser} />),
					});
				} else if (data.details === 'username') {
					axios({
						method: 'post',
						url: 'http://localhost:8080/visited',
						headers: {
							logToken: localStorage.getItem('logToken'),
						},
						data: data.askedUser,
					}).then(({data}) => {
						if (data.details === 'blocked') {
							browserHistory.push('/matcha/board');
						}
					});
					this.setState({
						data: data.askedUser,
						loggedUser: data.loggedUser,
						centerComp: (<ProfileComps.ProfileCompInfos data={data.askedUser} data2={data.loggedUser}/>),
					})
				}
			} else {
				browserHistory.push(`/matcha/board`);
			}
		})
	}

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	componentWillMount() {
		this.getData(this.props.params.username);
	}

	componentWillReceiveProps = (newProps) => {
		this.getData(newProps.params.username);
	}

	setCenter = (component) => {
		this.setState({ centerComp: component });
	};

	updateLike = (like) => {
		this.setState({ data: { ...this.state.data, alreadyLiked: like } });
	};

	render() {
		if (!this.state.data) return (<div>loading...</div>)
		else {
			return (
				<div className='userProfile'>
					<div className='leftMenu'>
						{this.state.data &&
							<LeftMenuProfile
							setCenter={this.setCenter}
							data={this.state.data}
							loggedUser1={this.state.loggedUser}
							updateLike={this.updateLike}
							/>
						}
					</div>
					<div className='userProfileCenter'> {this.state.centerComp} </div>
					<div className='rightMenu'> <RightMenuProfile username={this.props.params.username}/> </div>
				</div>
			)
		}
	}
}

export default userProfile;
