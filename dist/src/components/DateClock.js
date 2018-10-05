import React, { Component } from 'react';
import UpTimeBlock from './props/UpTimeProp';
import TimeZoneProp from './props/TimeZoneProp';
import moment from 'moment';
import timezone from 'moment-timezone';
import md5 from 'md5';
import axios from 'axios'
import tzList from './props/constVars';

/*
*  Bugs:     
*   
*      
*   
*  Enhancements:
*      Design / structure
*      Styling
*
*/
class DateClock extends Component {
    
    newlist = [];

    constructor() {
        super();
        const dateObject = new Date(),
            zeroAddInt = time => (time < 10) ? [0, time] : time.toString().split('').map(i => parseInt(i)),    
            currentTimeMinutes = zeroAddInt(dateObject.getMinutes()),
            currentTimeHours = dateObject.getHours(),
            initArgs = window.location.search.slice(1)
                        .split('&')
                        .reduce(function _reduce(/*Object*/ a, /*String*/ b) {
                            b = b.split('=');
                            a[b[0]] = decodeURIComponent(b[1]);
                            return a;
                        }, {});

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

    upTime = ( threshold, affectedTimePoint, secondThreshold ) => {
        
        const iterationObjCreate = eatThis => {
           let stateObj =  {}
           stateObj[eatThis] = this.state[eatThis] + 1
           return stateObj
        }

        const defaultObjCreate = defaultTimePoint => {
            let stateObj = {}
            stateObj[defaultTimePoint] = 0
            return stateObj
        }

        const finalObj = (timePointKey, timePointValue ) => {
            let stateObj = {}
            stateObj[timePointKey] = timePointValue + 1
            return stateObj
        }


        let replacer = affectedTimePoint
                                .replace('init', '')
                                .replace('s', '')
                                .replace("M", "m");

        replacer = (replacer == "Hour") ? "hourR" : replacer;
        
        
        (this.state[affectedTimePoint] !== threshold) ?
            this.setState(iterationObjCreate(affectedTimePoint)) :
            this.setState(defaultObjCreate(affectedTimePoint))
        
        const newTimes = this.state.allTimes.map(obj => {
            let trasnformHour = incr => (incr > secondThreshold) ? -1 : incr,
                    hourTransformed = trasnformHour(obj.time[replacer]),
                    newTime = Object.assign({}, obj.time, finalObj( replacer , hourTransformed ));
            return { time: newTime }
        })
    
        this.setState({ allTimes: newTimes })

    }

    shareTime = () => {
        let zeroAdd  = time => (time < 10) ? "0" + time : time,
            
            { initHours, initMinutesL, initMinutesR, initTimezone} = this.state,
            textArea = document.createElement('textarea'),
            clock = `${zeroAdd(initHours)}${initMinutesL}${initMinutesR}`,
            host = document.location.host,
            baseArgs = "?t=" + clock + "&tz="+ initTimezone,
            argsObject = { 
                shareArgs: baseArgs,
                hash: md5(baseArgs).substring(0, 5),
            };
            
            this.setState(argsObject)
            axios.post('process.php', argsObject)
            textArea.value = host + baseArgs
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand("Copy")
            textArea.remove()
    }
    
    timeArgChecker = timeEntered => {
        let { initArgs: { tz }, timeZones } = this.state,
            timeParse = (first, second) => parseInt(timeEntered.substring(first, second)),
            entryError = theAlert => { this.timeReset(); alert(theAlert) },
            timeZoneAvailability = (timeZone) => timeZone == tz;
        
        // Check if timezone argument is entered correctly
        if (tz !== undefined) {
            (timeZones.some(timeZoneAvailability)) ? 
            this.setState({ initTimezone: tz }) : 
                tentryError("INCORRECT TIMEZONE");
        }
            
        if (timeEntered <= 0 || timeEntered.length > 4)
            entryError("THAT'S NOT HOW ANYONE ENTERS TIME")

        if (timeEntered.length === 3)
            this.setState({ initHours: timeParse(0, 1)})
 
        if (timeEntered.length === 4) {
            let theHours = timeParse(0, 2), theMinutesL = timeParse(2, 3), theMinutesR = timeParse(3, 4);
            
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
        let zeroAdd      = time => (time < 10) ? "0" + time : time,
            tzSplit      = tz => (tz[1] == undefined) ? tz[0] : tz[1],
            underReplace = string => string.replace(/_/g, ' '),
            timeSplitter = time => time.split('').map(i => i),
            {initDate: { day, month, year }, initTime, initTimezone } = this.state,
            theDate = `${year}-${zeroAdd(month)}-${zeroAdd(day)} ${initTime}`,
            current = moment.tz(theDate, initTimezone),
            newCurrent = current.clone().tz(timeZone).format('hh:mm'),
            splitTimeClockL = newCurrent.split(':'),
            splitTimeClock = timeSplitter(newCurrent).map(i => parseInt(i));
            
            this.newlist.push({
                    time: {
                        tz: underReplace(timeZone),
                        hourR: parseInt(splitTimeClockL[0]),
                        minuteL: splitTimeClock[3],
                        minuteR: splitTimeClock[4],
                    }
                })
    }

    initTimeSet = () => {
        let zeroAddInt = time => (time < 10) ?
            [0, time] :
            time.toString().split('').map(i => parseInt(i)),

            currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
            dateObject = new Date(),
            currentTimeHours = dateObject.getHours(),
            currentTimeMinutes = dateObject.getMinutes(),
            intMinutes = zeroAddInt(currentTimeMinutes);

        (this.state.initArgs[""] === 'undefined') ?
            this.setState({
                    initHours: currentTimeHours,
                    initMinutesL: intMinutes[0],
                    initMinutesR: intMinutes[1],
                    initTimezone: currentTimeZone,
                    initTime: `${currentTimeHours}:${intMinutes[0]}${intMinutes[1]}`
                })
        :
            this.timeArgChecker(this.state.initArgs.t)
    }

    componentWillMount() {        
        this.initTimeSet()
        moment.tz.names().forEach(i => this.timeZoneConvert(i))
        this.setState({ allTimes: this.newlist })
        
        let querystring =  document.location.host + '/?',
            { initArgs : { t, tz}, initHours, initMinutesL, initMinutesR, initTimezone } = this.state,
            newArgs = Object.assign({tz: undefined, t: undefined}, this.state.initArgs);

        (tz === undefined && t === undefined) ?
            querystring += `t=${initHours}${initMinutesL}${initMinutesR}&tz=${initTimezone}` :
            querystring += `t=${newArgs.t}&tz=${newArgs.tz}`
        
            this.setState({ finalArgs: querystring })
    }
    
    componentDidMount() {
       console.log("APP SUCCESSFULLY LOADED")
    }

    render() {        
        return(
            <div className="dateClock">
                <button onClick={this.shareTime}>SHARE</button>
                <div className="dateClock__left">
                <button onClick={() => this.upTime( 23, "initHours", 22 )}>↑</button>
                    <UpTimeBlock
                        hours={this.state.initHours}
                        minutesL={this.state.initMinutesL}
                        minutesR={this.state.initMinutesR}
                        timezone={this.state.initTimezone}></UpTimeBlock>
                </div>
                <div className="dateClock__right">
                    <button
                        className="up-time right"
                        onClick={() => this.upTime( 5, "initMinutesL", 4 )}>↑</button>
                    <br></br>
                    <button
                        className="up-time right"
                        onClick={() => this.upTime( 9, "initMinutesR", 8 )}>↑</button>
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