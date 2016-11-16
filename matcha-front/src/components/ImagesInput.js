import React from 'react';
import '../../css/style.css';

export default ({ func, children }) => {
	return (
		<div className='beforeInput'>
			<div className='imagesInput'>
				<label className='imagesLabel'>Your pictures</label>
				{children}
			</div>
		</div>
	);
}
