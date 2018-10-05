import React from 'react';

	const UpTimeBlock = (props) => {
		return (<span className="currentTime">{props.hours}:{props.minutesL}{props.minutesR}, {props.timezone}</span>);
	}
export default UpTimeBlock;