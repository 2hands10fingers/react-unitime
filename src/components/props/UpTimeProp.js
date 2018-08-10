import React from 'react';

	const UpTimeBlock = (props) => {
		return (<span>{props.hours}:{props.minutesL}{props.minutesR}, {props.timezone}</span>);
	}
export default UpTimeBlock;