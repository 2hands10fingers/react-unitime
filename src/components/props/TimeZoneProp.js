import React from 'react';

	// const TimeZoneProp = (props) => {
	// 	return (<li>{props.timezone}</li>);
	// }


	const TimeZoneProp = (props) => {
		return (

				<li>
						{props.timeZone} - {props.hourRs}:{props.minuteLs}{props.minuteRs}
				</li>

		);

	}
export default TimeZoneProp;