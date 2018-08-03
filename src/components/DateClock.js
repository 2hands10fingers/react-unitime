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


    timeArgChecker = timeEntered => {
        let urlArgs = window.location.search.slice(1)
                        .split('&')
                        .reduce(function _reduce (/*Object*/ a, /*String*/ b) {
                        b = b.split('=');
                        a[b[0]] = decodeURIComponent(b[1]);
                        return a;
                        }, {});

        if (timeEntered < 0) alert("WTF MAN!")
        

        if (timeEntered.length === 4) {
            
            this.setState( 
                {
                    initHours:   timeEntered.substring(0, 2),
                    initMinutes: timeEntered.substring(2,4)
                }
            )

            console.log(this.state)
        }

        if (timeEntered === 3) {
            this.setState({
                initHours: "0" + timeEntered.substring(0,1),
                initMinutes: timeEntered.substring(1,2)
            })
        }
    }


    componentDidMount() {
        let urlArgs = window.location.search.slice(1)
                            .split('&')
                            .reduce(function _reduce (/*Object*/ a, /*String*/ b) {
                            b = b.split('=');
                            a[b[0]] = decodeURIComponent(b[1]);
                            return a;
                            }, {});
        
        function zeroAdd(time) {
            if (time < 10) return "0" + time
        }



        // console.log(urlArgs[""])
        let currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let dateObject = new Date()
        let currentTimeHours = dateObject.getHours();
        let currentTimeMinutes = dateObject.getMinutes();
        let stringMinutes = zeroAdd(currentTimeMinutes)

        if (urlArgs[""] === 'undefined') {
            console.log(currentTimeHours, ':', ',', currentTimeMinutes);
            
            this.setState(
                { 
                  initHours: currentTimeHours,
                  initMinutes: currentTimeMinutes,
                  initTimezone: currentTimeZone,
                  initTime: `${currentTimeHours}:${currentTimeMinutes}, ${currentTimeZone}`,
                  stringTimes: {
                      initMinutes: stringMinutes}
                }
            )
            
        } else {
            console.log('sup')
            Object.keys(urlArgs).forEach( i => console.log(urlArgs[i]))
            this.timeArgChecker(urlArgs["t"])
            console.log(this.state)
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