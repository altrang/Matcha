import axios from 'axios';
import {browserHistory} from 'react-router';

const addTag = (e, State) => {
	if (e.charCode === 13 && e.target.value.length > 1) {
		e.preventDefault();
		State = ({
			addedTags: [
				...State.addedTags,
				e.target.value.substring(0, e.target.value.length)
			]
		});
		e.target.value = '';
		return (State);
	}
	if (e.target.value.slice(-1) === ' ' && e.target.value.length > 1) {
		this.State.setState({
			addedTags: [
				...this.State.state.addedTags,
				e.target.value.substring(0, e.target.value.length - 1)
			]
		});
	}
	if (e.target.value.slice(-1) === ' ')
		e.target.value = '';
		return (State);
	};

const removeTag = (e, state) => {
	const index = state.state.addedTags.indexOf(e.target.innerHTML);
	state.state.addedTags.splice(index, 1);
	this.setState({addedTags: this.state.addedTags});
};

export { addTag, removeTag };
