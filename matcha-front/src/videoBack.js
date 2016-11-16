import React from 'react';
import '../css/style.css';

export default class Video extends React.Component {
	render () {
		return (
			<div>
			<video id="bgvid" loop autoPlay="true" muted preload="auto">
	  <source src={require("../data/Valentines/MP4/Valentines.mp4")} type="video/mp4" />
	  {/* <source src={require("../data/Valentines/OGV/Valentines.ogv")} type="video/ogg" /> */}
	  <source src={require("../data/Valentines/WEBM/Valentines.webm")} type="video/webm" />
	  Your browser does not support the video tag.
	</video>
	</div>
		)
	}
};
