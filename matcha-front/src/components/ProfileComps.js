import React from 'react';
import '../../css/editProfile.css';
import FontAwesome from 'react-fontawesome';
import TagDisplay from '../components/TagDisplay';


class ProfileCompInfos extends React.Component {
	state = {
		orientation: this.props.data.orientation,
		location: {
			address: 'Nothing Entered Yet',
		},
		likedMessage: '',
	}

	likeMessage = (userA, userB) => {
		if (userA.isLiked.indexOf(userB.username) !== -1) {
			this.setState({ likedMessage: 'Cet utilisateur vous a like!' });
		}
		else {
			this.setState({ likedMessage: '' });
		}
	};

	componentWillMount() {
		if (this.props.data) {
			if (this.props.data.orientation === '' || (!this.props.data.orientation))
				this.setState({ orientation: 'bisexual' });
			if (this.props.data.bio)
				this.setState({ bio: this.props.data.bio });
			if (this.props.data.location.address) {
				this.setState({
					location: {
						address: this.props.data.location.address,
					}
				});
			}
			if(this.props.data2) { this.likeMessage(this.props.data2, this.props.data); }
		}
	}

	componentWillReceiveProps = (newProps) => {
		if(newProps.data2) {
			this.likeMessage(newProps.data2, newProps.data);
		}
	}

	render() {
		const { username, firstname, lastname, age, birthdate, gender, popCount } = this.props.data;
		if (!this.props.data) return (<div></div>);
		return (
			<div className="ProfileComp">
				<span className="firstSpan">{username}'s Profile</span>
				<div className="ProfileCompInfos">
					<span> About </span><br />
					<span> Firstname: {firstname} </span><br />
					<span> Lastname: {lastname} </span><br />
					<span> Age: {age} </span><br />
					<span> Birthday: {birthdate} </span><br />
					<span> Gender: <FontAwesome name={gender} /> </span><br />
					<span> Orientation: {this.state.orientation} </span><br />
					<span> Ville: {this.state.location.address} </span><br />
					<span> PopScore: {popCount} </span><br />

				</div>
				<span>{this.state.likedMessage}</span><br />
				<span>{this.props.data.connected}</span>

			</div>
		);
	}
}

class ProfileCompPhotos extends React.Component {
	render() {
		const { image } = this.props.data;
		const imgList = image.map((src, key) => <div key={key}>
		<div className="images">
			<img role="presentation" width="250px" height="250px" src={"http://localhost:8080/public/" + src}/>
			</div>
        </div>);
		return (
			<div className="ProfileComp">
				<span className="firstSpan">{this.props.data.username}'s Photos</span>
				<div className="upload">
				{((image.length > 0) && (<ul className="imagesDisplays">{imgList}</ul>)) || (<div>no photo yet</div>)}
				</div>
			</div>
		)
	}
}

class ProfileCompBio extends React.Component {
	state = {
		bio: 'Nothing Entered Yet',
		tags: 'Nothing Entered Yet',
	}

	componentWillMount() {
		if (this.props.data.bio)
			this.setState({ bio: this.props.data.bio });
		if (this.props.data.tags)
			this.setState({ tags: this.props.data.tags });
	}

	render() {
		const { username } = this.props.data;
		return (
			<div>
			<div className="ProfileComp">
				<span className="firstSpan">{username}'s Bio</span>
			<span> Bio: {this.state.bio} </span><br />
			</div>
			<TagDisplay name="tags" type="text" label="Tags" username={username} ref="tags" addedTags={this.state.tags} className='tagLists' />
			</div>
		)
	}
}

export { ProfileCompInfos, ProfileCompPhotos, ProfileCompBio }
