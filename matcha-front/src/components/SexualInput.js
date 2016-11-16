import React from 'react';
import '../../css/style.css';

export default class SexualInput extends React.Component {
	state = {
		isChecked1: '',
		isChecked2: '',
		isChecked3: '',
	}

	check = (e, newProps) => {
		const { value1, value2, value3 } = this.props;
		const checked = e ? e.target.value : newProps.checked;
		this.setState({ isChecked1: '', isChecked2: '', isChecked3: '' });
		if (checked === value1) {
			this.setState({ isChecked1: 'isChecked' });
		} else if (checked === value2) {
			this.setState({ isChecked2: 'isChecked' });
		} else if (checked === value3) {
			this.setState({ isChecked3: 'isChecked' });
		}
	}

	componentWillReceiveProps = (newProps) => {
		this.check(null, newProps);
	}

	componentWillMount() {
		this.check(null, this.props);
	}

	render() {
		const { label, value1, value2, value3, name, checked } = this.props;
		const { isChecked1, isChecked2, isChecked3 } = this.state;
		return (
			<div className="RadioInput">
				<label className="inputLabel">{label}</label>
				{this.props.children}
				<br />
				<div className="selector">
					<label className={`label ${isChecked1}`} htmlFor={value1}>{value1.toUpperCase()}</label>
					<label className={`label ${isChecked2}`} htmlFor={value2}>{value2.toUpperCase()}</label>
					<label className={`label ${isChecked3}`} htmlFor={value3}>{value3.toUpperCase()}</label>
					<input type="radio" name={name} value={value1} id={value1} onClick={this.check} defaultChecked={checked === value1}/>
					<input type="radio" name={name} value={value2} id={value2} onClick={this.check} defaultChecked={checked === value2}/>
					<input type="radio" name={name} value={value3} id={value3} onClick={this.check} defaultChecked={checked === value3}/>
				</div>
			</div>
		);
	}
}
