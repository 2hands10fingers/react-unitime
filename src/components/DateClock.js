import React, { Component } from 'react';
import UpTimeBlock from './props/UpTimeProp';
import TimeZoneProp from './props/TimeZoneProp';
import moment from 'moment';
import timezone from 'moment-timezone';

/*
*  Bugs:
*      1. Hours keep decrementing/incrementing after top time has already hit zero
*      2. Shared time is one hour lower than what it's supposed to be.
*
*/
class DateClock extends Component {
    newlist = []

    constructor() {
        super();
        const dateObject = new Date(),
            zeroAddInt = time => (time < 10) ?
                [0, time] :
                time.toString().split('').map(i => parseInt(i)),
                
            currentTimeMinutes = zeroAddInt(dateObject.getMinutes()),
            currentTimeHours = dateObject.getHours(),
            initArgs = window.location.search.slice(1)
                        .split('&')
                        .reduce(function _reduce(/*Object*/ a, /*String*/ b) {
                            b = b.split('=');
                            a[b[0]] = decodeURIComponent(b[1]);
                            return a;
                        }, {})

        this.state = {
            initTime: `${currentTimeHours}:${currentTimeMinutes[0]}${currentTimeMinutes[1]}`,
            initHours: currentTimeHours,
            initMinutes: dateObject.getMinutes(),
            initMinutesL: currentTimeMinutes[0],
            initMinutesR: currentTimeMinutes[1],
            initTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            allTimes: undefined,    
            initArgs: initArgs,
            finalArgs: {t: undefined, tz: undefined},
            timeZones: moment.tz.names(),
            initDate: {
                month: dateObject.getMonth() + 1,
                day: dateObject.getDate(),
                year: dateObject.getUTCFullYear()
            }
        }

    }

    timeReset = () => { this.setState({ initHours: 0, initMinutesL: 0, initMinutesR: 0, }) }

    upClickMinutesL = () => {
        (this.state.initMinutesL !== 5) ?
            this.setState({ initMinutesL: this.state.initMinutesL + 1 }) :
            this.setState({ initMinutesL: 0 })
        
        const newTimes = this.state.allTimes.map(obj => {
            let trasnformHour = incr => (incr > 5) ? -1 : incr,
                    hourTransformed = trasnformHour(obj.time.minuteL),
                    newTime = Object.assign({}, obj.time, { minuteL: hourTransformed + 1 });
            return {
                time: newTime
            }
        })
    
        this.setState({
            allTimes: newTimes
        })
    

    }
    downClickMinutesL = () => {
        (this.state.initMinutesL !== 0) ?
            this.setState({ initMinutesL: this.state.initMinutesL - 1 }) :
            this.setState({ initMinutesL: 0 })
        
            const newTimes = this.state.allTimes.map(obj => {
            let trasnformHour = incr => (incr !== 0) ? incr - 1 : 0,
                    hourTransformed = trasnformHour(obj.time.minuteL),
                    newTime = Object.assign({}, obj.time, { minuteL: hourTransformed });
            return {
                time: newTime
            }
        })
    
        this.setState({ allTimes: newTimes })
    }
    upClickMinutesR = () => {
        (this.state.initMinutesR !== 9) ?
            this.setState({ initMinutesR: this.state.initMinutesR + 1 }) :
            this.setState({ initMinutesR: 0 })
        
            const newTimes = this.state.allTimes.map(obj => {
            let trasnformHour = incr => (incr > 8) ? -1 : incr,
                    hourTransformed = trasnformHour(obj.time.minuteR),
                    newTime = Object.assign({}, obj.time, { minuteR: hourTransformed + 1 });
            return {
                time: newTime
            }
        })
    
        this.setState({ allTimes: newTimes })

    }
    downClickMinutesR = () => {
        (this.state.initMinutesR !== 0) ?
            this.setState({ initMinutesR: this.state.initMinutesR - 1 }) :
            this.setState({ initMinutesR: 0 })

        const newTimes = this.state.allTimes.map(obj => {
            let trasnformHour = incr => (incr !== 0 ) ? incr - 1 : 0,
                    hourTransformed = trasnformHour(obj.time.minuteR),
                    newTime = Object.assign({}, obj.time, { minuteR: hourTransformed });
            return {
                time: newTime
            }
        })
    
        this.setState({ allTimes: newTimes })
    }
    upClickHours = () => {
        
        (this.state.initHours === 23) ?
            this.setState({ initHours: 0 }) :
            this.setState(
                { initHours: this.state.initHours + 1 }
            )
        
        const newTimes = this.state.allTimes.map(obj => {
            const trasnformHour = incr => (incr > 22) ? -1 : incr,
                  hourTransformed = trasnformHour(obj.time.hourR),
                  newTime = Object.assign({}, obj.time, { hourR: hourTransformed + 1 });
            return {
                time: newTime
            }
        })
        // document.getElementsByClassName('currentTime')[0].innerText
        this.setState({
            allTimes: newTimes,
            finalTime: `${this.state.initHours}${this.state.initMinutesL}${this.state.initMinutesR}`
        })
    }
    downClickHours = () => {
        
        (this.state.initHours === 23) ?
            this.setState({ initHours: 0 }) :
            this.setState({ initHours: this.state.initHours + 1 })
        
        const newTimes = this.state.allTimes.map(obj => {
            const trasnformHour = incr => (incr !== 0) ? incr - 1 : 0,
                  hourTransformed = trasnformHour(obj.time.hourR),
                  newTime = Object.assign({}, obj.time, { hourR: hourTransformed });
            return {
                time: newTime
            }
        })

        this.setState({ allTimes: newTimes })
    }

    shareTime = () => {
        let textArea = document.createElement('textarea')
        textArea.value = this.state.finalArgs
		document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("Copy")
        textArea.remove()
    }

    timeArgChecker = timeEntered => {
        let currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
            timeParse = (first, second) => parseInt(timeEntered.substring(first, second)),
            entryError = theAlert => { this.timeReset(); alert(theAlert) };

        (this.state.initArgs.tz === undefined) ?
            this.setState({ initTimezone: this.state.initTimezone }) :
            this.setState({ initTimezone: this.state.initArgs.tz })

        if (timeEntered <= 0 || timeEntered.length > 4) {
            entryError("THAT'S NOT HOW ANYONE ENTERS TIME")
        }

        if (timeEntered.length === 4) {
            let theHours = timeParse(0, 2),
                theMinutesL = timeParse(2, 3),
                theMinutesR = timeParse(3, 4);

            if (theHours > 24) {
                entryError("NAH FAM. YOUR HOURS CAN'T BE HIGHER THAN 24")

            } else if (theMinutesL > 5 || theMinutesR > 9) {
                entryError("NAH FAM. YOU CAN'T SET MINUTES LIKE THAT")

            } else {
                this.setState({ initHours: theHours, initMinutesL: theMinutesL, initMinutesR: theMinutesR })
            }
        }

        if (timeEntered.length === 3)
            this.setState({ initHours: timeParse(0, 1), initMinutesL: timeParse(1, 2) })

        if (timeEntered.length === 2 && timeEntered < 25)
            this.setState({ initHours: parseInt(timeEntered), initMinutesL: 0, initMinutesR: 0 })
    } //end timeArgChecker()

    timeZoneConvert = timeZone => {
        let zeroAdd = (time) => (time < 10) ? "0" + time : time,
            tzSplit = tz => (tz[1] == undefined) ? tz[0] : tz[1],
            underReplace = string => string.replace('_', ' '),
            timeSplitter = time => time.split('').map(i => i),

            currentDateSel = this.state.initDate,
            day = currentDateSel.day,
            month = currentDateSel.month,
            year = currentDateSel.year,
            theDate = `${year}-${zeroAdd(month)}-${zeroAdd(day)} ${this.state.initTime}`,
            current = moment.tz(theDate, this.state.initTimezone),
            newCurrent = current.clone().tz(timeZone).format('hh:mm'),
            splitTimeClockL = newCurrent.split(':'),
            splitTimeClock = timeSplitter(newCurrent).map(i => parseInt(i));
        this.newlist.push(
            {
                time: {
                    tz: underReplace(timeZone),
                    hourR: parseInt(splitTimeClockL[0]),
                    minuteL: splitTimeClock[3],
                    minuteR: splitTimeClock[4],
                }
            })
    }

    initTimeSet = () => {
        let zeroAdd = time => (time < 10) ? "0" + time : time,
            zeroAddInt = time => (time < 10) ?
                [0, time] :
                time.toString().split('').map(i => parseInt(i)),

            currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
            dateObject = new Date(),
            currentTimeHours = dateObject.getHours(),
            currentTimeMinutes = dateObject.getMinutes(),
            intMinutes = zeroAddInt(currentTimeMinutes);

        if (this.state.initArgs[""] === 'undefined') {
            this.setState(
                {
                    initHours: currentTimeHours,
                    initMinutesL: intMinutes[0],
                    initMinutesR: intMinutes[1],
                    initTimezone: currentTimeZone,
                    initTime: `${currentTimeHours}:${intMinutes[0]}${intMinutes[1]}`
                }
            )


        } else {
            this.timeArgChecker(this.state.initArgs.t)
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // L I F E C Y C L E ///////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    componentWillMount() {
        this.initTimeSet()
        moment.tz.names().forEach(i => this.timeZoneConvert(i))
        this.setState({ allTimes: this.newlist })
        
        let querystring = 'localhost:8080/?',
            newArgs = Object.assign({tz: undefined, t: undefined}, this.state.initArgs);

        (this.state.initArgs.tz === undefined && this.state.initArgs.t === undefined) ?
            querystring += `t=${this.state.initTime.replace(':', '')}&tz=${this.state.initTimezone}` :
            querystring += `t=${newArgs.t}&tz=${newArgs.tz}`
        
        this.setState({ finalArgs: querystring })
    }
    
    componentDidMount() {
       //pass 
    }

    render() {


        return (
            <div className="dateClock">
                <button onClick={this.shareTime}>SHARE</button>
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
                    <div className="timeZones">
                        <ul>
                            {this.state.allTimes.map(item =>
                                <TimeZoneProp
                                    key ={item.time.tz}
                                    timeZone={item.time.tz}
                                    hourRs={item.time.hourR}
                                    minuteLs={item.time.minuteL}
                                    minuteRs={item.time.minuteR}>
                                </TimeZoneProp>)}
                        </ul>
                    </div>
                </div>
            </div>

        )
    }
}

export default DateClock;