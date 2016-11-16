import React, { Component } from 'react';
import Video from './videoBack';

class App extends Component {
	render() {
		return (
			<div className="invert">
	    		<div className="App">
					<Video />
		        	{this.props.children}
				</div>
			</div>
		);
	}
}

export default App;
