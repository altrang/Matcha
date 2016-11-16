import React from 'react';
import '../../css/tagInput.css';

export default class TagInput extends React.Component {
	state = {
		addedTags: [],
	}

	addTag = (e) => {
        if (e.charCode === 13 && e.target.value.length > 1) {
			e.preventDefault();
			if (e.target.value.indexOf(' ') === -1) {
            	this.setState({
                	addedTags: [
                    	...this.state.addedTags,
                    	e.target.value.substring(0, e.target.value.length)
                	]
            	});
			}
        	e.target.value = '';
        }
        if (e.target.value.slice(-1) === ' ' && e.target.value.length > 1 ) {

			if (e.target.value.indexOf(' ') === e.target.value.length - 1) {
            this.setState({
                addedTags: [
                    ...this.state.addedTags,
                    e.target.value.substring(0, e.target.value.length - 1)
                ]
            });
		}
        }
        if (e.target.value.slice(-1) === ' ') {
			e.target.value = '';
		}
    }

	removeTag = (e) => {
		const index = this.state.addedTags.indexOf(e.target.innerHTML);
		this.state.addedTags.splice(index, 1);
		this.setState({addedTags: this.state.addedTags});
	};

	componentWillMount() {
		this.setState({ addedTags: this.props.tagList });
	}

	componentWillReceiveProps = (newProps) => {
		this.setState({ addedTags: newProps.tagList });
	}

	enter = (e) => {
		if (e.keyCode === 13) e.preventDefault();
	};

	render() {
		const {
			label,
			type,
			placeholder,
			name,
		} = this.props;
		const { addedTags } = this.state;
		const tagsList = addedTags.map((tag, key) => <li onClick={this.removeTag} key={key}>{tag}</li>);
		return (
			<div className="beforeInput">
				<div className="tagInput">
					<label className="inputLabel">{label}</label><br />
						<div className='tagDiv'>{tagsList}</div>
					<input className='tagInputText' type={type} onKeyDown={this.enter} placeholder={placeholder} name={name} onKeyPress={this.addTag} onChange={this.addTag} />
				</div>
			</div>
		);
	}
}
