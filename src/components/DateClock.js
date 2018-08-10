import React from 'react';
import UpTimeBlock from './props/UpTimeProp';
import TimeZoneProp from './props/TimeZoneProp';
import TimeZoneComp from './TimeZones';
import moment from 'moment';
import timezone from 'moment-timezone';

class DateClock extends React.Component {
    state = {
        initTime: undefined,
        initHours: undefined,
        initMinutes: undefined,
        initMinutesL: undefined,
        initMinutesR: undefined,
        initTimezone: undefined,
        initDate: undefined
    }

    timezones = moment.tz.names()

    timeArgChecker = timeEntered => {
        let urlArgs = window.location.search.slice(1)
                        .split('&')
                        .reduce(function _reduce (/*Object*/ a, /*String*/ b) {
                        b = b.split('=');
                        a[b[0]] = decodeURIComponent(b[1]);
                        return a;

                        }, {}),
            currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        (urlArgs["tz"] === undefined) ? this.setState({ initTimezone: currentTimeZone}) : 
                                        this.setState({ initTimezone: urlArgs["tz"] })
        
        if (timeEntered <= 0 || timeEntered.length > 4) { alert("THAT'S NOT HOW ANYONE ENTERS TIME"); this.timeReset() }
        
        if (timeEntered.length === 4) {
                let theHours = parseInt(timeEntered.substring(0,2)),
                    theMinutesL = parseInt(timeEntered.substring(2,3)),
                    theMinutesR = parseInt(timeEntered.substring(3,4))
                
                
                if (theHours > 24) { this.timeReset(); alert("NAH FAM. YOUR HOURS CAN'T BE HIGHER THAN 24") }
                
                else if(theMinutesL > 5 || theMinutesR > 9) { this.timeReset(); alert("NAH FAM. YOU CAN'T SET MINUTES LIKE THAT")} 
                
                else { this.setState({ initHours: theHours, initMinutesL: theMinutesL, initMinutesR: theMinutesR }) }
        }


            console.log(this.state)
        }


        if (timeEntered.length === 2 && timeEntered < 25) {
            this.setState({ initHours: parseInt(timeEntered), initMinutesL: 0, initMinutesR: 0 }) } 
        
        else if (timeEntered.length < 2) { this.timeReset(); alert("NAH FAM. YOUR HOURS CAN'T BE HIGHER THAN 24")}

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


        // console.log(urlArgs[""])
        let currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;



        
        let dateObject = new Date(),
            currentTimeHours = dateObject.getHours(),
            currentTimeMinutes = dateObject.getMinutes(),
            intMinutes = zeroAddInt(currentTimeMinutes),
            intMinutesL = intMinutes[0],
            intMinutesR = intMinutes[1];

            console.log(dateObject)

        
        if (urlArgs[""] === 'undefined') {
    
            this.setState(
                { 
                  initHours: currentTimeHours,
                  initMinutes: currentTimeMinutes,
                  initTimezone: currentTimeZone,
                  initTime: `${currentTimeHours}:${currentTimeMinutes}`,
                  initDate: {  year: dateObject.getUTCFullYear(),
                               month: dateObject.getDate(),
                               day: dateObject.getMonth() + 1,
                               fullyear: `${dateObject.getUTCFullYear()}-${dateObject.getDate()}-${dateObject.getMonth() + 1}`
                        }
                    }
                
            )

            

            
        } else {

            this.timeArgChecker(urlArgs["t"])
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

    upClickHours    =   () => {
            (this.state.initHours === 24)  ?
            this.setState({ initHours: 0}) :
            this.setState(
                { initHours: this.state.initHours + 1}
            )
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

    timeZoneConvert = timeZone => { 
        //console.log(this.state['initDate']['fullyear'])  <---- WHY DOESN'T THIS WORK???????

        return `${timeZone} - ${moment.tz(this.state.initTime, timeZone).utc().format('HH:MM')}`
    }
 

    render() {
        return(
            <div className="dateClock">
            <div className="datesplit">{this.dateSplit}</div>
                <div className="dateClock__left">

                    <button onClick={this.upClickHours}>↑</button> 
                    <button onClick={this.downClickHours}>↓</button>
                    

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

                        className="down-time right" 
                        onClick={this.downClickMinutesR}>↓</button>
                </div> 
                            <div>
              <ul>{this.timezones.map(item => <TimeZoneProp key={item} timezone={this.timeZoneConvert(item)}></TimeZoneProp>)}</ul>

            </div>
            </div>
            

            


        )
    }



}

export default DateClock;