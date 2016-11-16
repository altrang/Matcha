import React from 'react';

class InputMatch extends React.Component {
	state = {
		valDef: null,
	}

	render () {
	const { label, type, name, children, valDef, bioLimit } = this.props;
	return (
		<div className="beforeInput">
		<div className="inputMatch">
			<label className="inputLabel">{label}</label>
			{children}
			<input type={type} onKeyPress={bioLimit} defaultValue={valDef} name={name} />
		</div>
		</div>
	);
	}
}

export default InputMatch;
