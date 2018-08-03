import React from 'react';
import UpTimeBlock from './props/UpTimeProp';

class DateClock extends React.Component {

    state = {
        initTime: undefined,
        initHours: undefined,
        initMinutes: undefined,
        initTimezone: undefined,
        stringTimes: {
            initMinutes: undefined
        }
    }

    componentDidMount() {
        function zeroAdd(time) {
            if (time < 10) return "0" + time
        }

        let currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let dateObject = new Date()
        let currentTimeHours = dateObject.getHours();
        let currentTimeMinutes = dateObject.getMinutes();
        let stringMinutes = zeroAdd(currentTimeMinutes)

        if (this.state.initTime === undefined) {
            console.log(currentTimeHours, ':', ',', currentTimeMinutes);
            
            this.setState(
                { initHours: currentTimeHours,
                  initMinutes: currentTimeMinutes,
                  initTimezone: currentTimeZone,
                  initTime: `${currentTimeHours}:${currentTimeMinutes}, ${currentTimeZone}`,
                  stringTimes: {
                      initMinutes: stringMinutes
                  }
                }
            )
        }

    }

    upClick = () => {
        let theState = this.state
        this.setState({
            initMinutes: theState.initMinutes + 1
        })
        
        if (theState.initMinutes >= 60) {
            this.setState({
                initMinutes: 0,
                initHours: theState.initHours + 1
            })
        } 
        
        if (theState.initHours >= 24) {
            this.setState({
                initMinutes: 0,
                initHours: 0
            })
        } 
    }

    downClick = () => {
        
        let theState = this.state
        
        this.setState({ initMinutes: theState.initMinutes - 1 })
        
        if (theState.initMinutes <= 0) {
            this.setState({
                initMinutes: 60,
                initHours: theState.initHours - 1
            })

            if (theState.initMinutes == 60) {
                this.setState({
                    initMinutes: "00",
                })
            }
        } 

    }

    render() {
        return(
            <div className="dateClock">
                <div className="dateClock__left">
                    <UpTimeBlock 
                        hours={this.state.initHours} 
                        minutes={this.state.initMinutes} 
                        timezone={this.state.initTimezone}></UpTimeBlock>
                </div>
                <div className="dateClock__right">
                    <button 
                        className="up-time" 
                        onClick={this.upClick}>↑</button>
                    <button 
                        className="down-time" 
                        onClick={this.downClick}>↓</button>

                </div>
            </div>

        )
    }



}

export default DateClock;