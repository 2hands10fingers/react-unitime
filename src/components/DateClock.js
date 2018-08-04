import React from 'react';
import UpTimeBlock from './props/UpTimeProp';

class DateClock extends React.Component {
    state = {
        initTime: undefined,
        initHours: undefined,
        initMinutes: undefined,
        initMinutesL: undefined,
        initMinutesR: undefined,
        initTimezone: undefined
    }

    timeReset = () => { this.setState({ initHours: 0, initMinutesL: 0, initMinutesR: 0, }) }
    timeArgChecker = timeEntered => {
        // Parse URL args. Returns as object.
        let urlArgs = window.location.search.slice(1) 
                        .split('&')
                        .reduce(function _reduce (/*Object*/ a, /*String*/ b) {
                        b = b.split('=');
                        a[b[0]] = decodeURIComponent(b[1]);
                        return a;
                        }, {}),
            currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

        (urlArgs["tz"] === undefined) ? this.setState({ initTimezone: currentTimeZone}) : 
                                        this.setState({ initTimezone: urlArgs["tz"] })
        
        if (timeEntered <= 0 || timeEntered.length > 4) { alert("THAT'S NOT HOW ANYONE ENTERS TIME"); this.timeReset() }
        
        if (timeEntered.length === 4) {
                let theHours = parseInt(timeEntered.substring(0,2)),
                    theMinutesL = parseInt(timeEntered.substring(2,3)),
                    theMinutesR = parseInt(timeEntered.substring(3,4))
                
                if (theHours > 24) { this.timeReset(); alert("NAH FAM. YOUR HOURS CAN'T BE HIGHER THAN 24")
                
                } else if(theMinutesL > 5 || theMinutesR > 9) {
                    this.timeReset()                    
                    alert("NAH FAM. YOU CAN'T SET MINUTES LIKE THAT")    

                } else {

                    this.setState({
                        initHours:    theHours,
                        initMinutesL: theMinutesL,
                        initMinutesR: theMinutesR
                    })

                }
        }

        if (timeEntered.length === 3) {
            this.setState({
                initHours: parseInt(timeEntered.substring(0,1)),
                initMinutesL: parseInt(timeEntered.substring(1,2))
            })
        }

        if (timeEntered.length === 2 && timeEntered < 25) {
            this.setState({
                initHours: parseInt(timeEntered),
                initMinutesL: 0,
                initMinutesR: 0
            })
        } else if (timeEntered.length < 2){
            this.timeReset()                    
            alert("NAH FAM. YOUR HOURS CAN'T BE HIGHER THAN 24")
        }
    }


    componentDidMount() {
        let urlArgs = window.location.search.slice(1) // Parse URL args. Returns as object.
                            .split('&')
                            .reduce(function _reduce (/*Object*/ a, /*String*/ b) {
                            b = b.split('=');
                            a[b[0]] = decodeURIComponent(b[1]);
                            return a;
                            }, {});

        function zeroAddInt(time) {
            if (time < 10) {
                return [0 , time]
            } else {
                let newtime = time.toString().split('').map( i => parseInt(i))
                return [newtime[0], newtime[1]]
            }
        }

        let currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
            dateObject = new Date(),
            currentTimeHours = dateObject.getHours(),
            currentTimeMinutes = dateObject.getMinutes(),
            intMinutes = zeroAddInt(currentTimeMinutes),
            intMinutesL = intMinutes[0],
            intMinutesR = intMinutes[1]

        if (urlArgs[""] === 'undefined') {
            console.log(currentTimeHours, ':', ',', currentTimeMinutes);
            
            this.setState(
                { 
                  initHours: currentTimeHours,
                  initMinutesL: intMinutesL,
                  initMinutesR: intMinutesR,
                  initTimezone: currentTimeZone,
                  initTime: `${currentTimeHours}:${currentTimeMinutes}, ${currentTimeZone}`
                }
            )
            
        } else {
            Object.keys(urlArgs).forEach( i => console.log(urlArgs[i]))
            this.timeArgChecker(urlArgs["t"])
        }

    }



    upClickMinutesL   = () => {
        (this.state.initMinutesL !== 5) ?
            this.setState({ initMinutesL: this.state.initMinutesL + 1 }) :
            this.setState({ initMinutesL: 0})
    }
    downClickMinutesL = () => {
            (this.state.initMinutesL !== 0) ?
            this.setState({ initMinutesL: this.state.initMinutesL - 1}) :
            this.setState({ initMinutesL: 0})
    }
    upClickMinutesR   = () => {
        (this.state.initMinutesR !== 9) ?
            this.setState({ initMinutesR: this.state.initMinutesR + 1 }) :
            this.setState({ initMinutesR: 0})
    }
    downClickMinutesR = () => {
            (this.state.initMinutesR !== 0) ?
            this.setState({ initMinutesR: this.state.initMinutesR - 1}) :
            this.setState({ initMinutesR: 0})
    }
    upClickHours    =   () => {
            (this.state.initHours === 24)  ?
            this.setState({ initHours: 0}) :
            this.setState(
                { initHours: this.state.initHours + 1}
            )
    } 


    render() {
        return(
            <div className="dateClock">
                <div className="dateClock__left">
                    <button onClick={this.upClickHours}>↑</button> 
                    <button onClick={this.downClickHours}>↓</button> 
                    <UpTimeBlock 
                        hours={this.state.initHours} 
                        minutesL={this.state.initMinutesL}
                        minutesR={this.state.initMinutesR} 
                        timezone={this.state.initTimezone}></UpTimeBlock>
                </div>
                <div className="dateClock__right">
                <button 
                        className="up-time right" 
                        onClick={this.upClickMinutesL}>↑</button>
                    <button 
                        className="down-time" 
                        onClick={this.downClickMinutesL}>↓</button>
                        <br></br>
                    <button 
                        className="up-time right" 
                        onClick={this.upClickMinutesR}>↑</button>
                    <button 
                        className="down-time right" 
                        onClick={this.downClickMinutesR}>↓</button>
                </div>

            </div>

        )
    }
}

export default DateClock;