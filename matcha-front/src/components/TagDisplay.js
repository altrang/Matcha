import React from 'react';
import '../../css/tagInput.css';

export default class TagDisplay extends React.Component {
	render() {
		const {
			addedTags,
			username
		} = this.props;
		const tagsList = addedTags.map((tag, key) => <li key={key}>{tag}</li>);
		return (
			<div className="ProfileComp">
			 	<label className="firstSpan">{username}'s Interests</label><br />
			 	<div className='tagDiv'>{tagsList}</div>
			</div>
		);
	}
}
