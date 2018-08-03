import React from 'react';
import UpTimeBlock from './props/UpTimeProp';

class DateClock extends React.Component {

    state = {
        initTime: undefined,
        initHours: undefined,
        initHoursL: undefined,
        initHoursR: undefined,
        initMinutes: undefined,
        initMinutesL: undefined,
        initMinutesR: undefined,
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

        function zeroAddInt(time) {
            if (time < 10) {
                return [0 , time]
            } else {
                var newtime = time.toString().split('').map( i => parseInt(i))
                console.log(newtime)
                return [newtime[0], newtime[1]]
            }

        }

        

        let currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let dateObject = new Date()
        let currentTimeHours = dateObject.getHours();
        let currentTimeMinutes = dateObject.getMinutes();
        let stringMinutes = zeroAdd(currentTimeMinutes)

        let intMinutes = zeroAddInt(currentTimeMinutes)
        let intMinutesL = intMinutes[0]
        let intMinutesR = intMinutes[1]
        let combinedInts = parseInt(intMinutes[0].toString() + intMinutes[1].toString())
        // console.log(combinedInts)

        // co

        if (urlArgs[""] === 'undefined') {
            console.log(currentTimeHours, ':', ',', currentTimeMinutes);
            
            this.setState(
                { 
                  initHours: currentTimeHours,
                  initMinutes: combinedInts,
                  initMinutesL: intMinutesL,
                  initMinutesR: intMinutesR,
                  initTimezone: currentTimeZone,
                  initTime: `${currentTimeHours}:${currentTimeMinutes}, ${currentTimeZone}`,
                  stringTimes: {
                      initMinutes: stringMinutes
                    }
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

        if (theState.initMinutes > 59) {
            this.setState({
                initHours: theState.initHours + 1,
                initHoursL: 0,
                initHoursR: 0
            })
        }

        if (theState.initMinutesR > 9) {
            this.setState({
                initMinutesL: 0,
                initMinutesR: 0,
                initMinutes: 0
                
                // initHours: theState.initHours + 1
            })
        } 
        
        if (theState.initHours >= 24) {
            this.setState({
                initMinutes: 0,
                initHours: 0
            })
        }
        
        this.setState({
            initMinutesR: theState.initMinutesR + 1,
            initMinutes:  theState.initMinutes + 1
        })
  
    }

    downClick = () => {
        
        let theState = this.state
        
        this.setState({ initMinutes: theState.initMinutes - 1 })
        
        if (theState.initMinutes <= 0) {
            this.setState({
                initMinutes: [0, 0],
                initHours: theState.initHours - 1
            })

            if (theState.initMinutes == 60) {
                this.setState({
                    initMinutes: [0,0],
                })
            }
        } 

    }

    render() {
        return(
            <div className="dateClock">
                <div className="dateClock__left">
                    <UpTimeBlock 
                        hoursL={this.state.initHoursL}
                        hoursR={this.state.initHoursR} 
                        minutesL={this.state.initMinutesL}
                        minutesR={this.state.initMinutesR} 
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