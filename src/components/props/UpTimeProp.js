import React from 'react';

	const UpTimeBlock = (props) => {
		return (<span>{props.hoursL}{props.hoursR}:{props.minutesL}{props.minutesR}, {props.timezone}</span>);
	}
export default UpTimeBlock;