import React from 'react';

	const UpTimeBlock = (props) => {
		return (<span>{props.hours}:{props.minutes}, {props.timezone}</span>);
	}

export default UpTimeBlock;