import React, { Component } from "react";
import './timerstyle2.css';

export default class Timer extends Component {
    today = new Date();
    constructor(props) {
        super(props);
        this.state = {

            remTime: this.today
        }
    }

    async componentDidMount() {
        // const { remTime } = this.state;
        var alarms = await new Promise((resolve) => chrome.alarms.getAll(resolve));
        alarms.sort(function (a, b) {
            return a.scheduledTime - b.scheduledTime;
        });
        var time = alarms[0].scheduledTime;
        this.setState(() => ({
            remTime: time - this.today
        }))
        this.myInterval = setInterval(() => {
            const { remTime } = this.state;
            // var n = new Date();
            // var k = this.coolMethod();
            if (remTime > 0) {
                this.setState(({ remTime }) => ({
                    remTime: remTime - 1000
                }))
            }
            if (remTime <= 0) {
                var alarms = new Promise((resolve) => chrome.alarms.getAll(resolve));
                alarms.sort(function (a, b) {
                    return a.scheduledTime - b.scheduledTime;
                });
                var time = alarms[0].scheduledTime;

                this.setState(() => ({
                    remTime: time - this.today
                }))
                console.log("ja");
                clearInterval(this.myInterval);
            }
        }, 1000)
    }


    componentWillUnmount() {
        clearInterval(this.myInterval);
    };

    render() {

        const { remTime } = this.state;
        var days = 0
        var hours = 0
        var minutes = 0
        var seconds = (remTime / 1000).toFixed(0);
        if (seconds >= 60) {
            minutes = Math.floor(seconds / 60);
            seconds = seconds % 60
        }
        if (minutes >= 60) {
            hours = Math.floor(minutes / 60)
            minutes = minutes % 60
        }
        if (hours >= 24) {
            days = Math.floor(hours / 24);
            hours = hours % 24
        }

        // return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        var timeString = ""
        if (days > 0) {
            if (hours < 10) {
                if (minutes < 10) {
                    if (seconds < 10) {
                        timeString = `Next class in..\n ${days} d: 0${hours} h: 0${minutes} m: 0${seconds} s`
                    }
                    else {
                        timeString = `Next class in..\n ${days} d: 0${hours} h: 0${minutes} m: ${seconds} s`
                    }
                }
                else {
                    timeString = `Next class in..\n ${days} d: 0${hours} h: ${minutes} m: ${seconds} s`
                }

            }
            else {
                timeString = `Next class in..\n ${days} d: ${hours} h: ${minutes} m: ${seconds} s`
            }
        } else {
            if (hours < 10) {
                if (minutes < 10) {
                    if (seconds < 10) {
                        timeString = `Next class in..\n 0${hours} h: 0${minutes} m: 0${seconds} s`
                    }
                    else {
                        timeString = `Next class in..\n 0${hours} h: 0${minutes} m: ${seconds} s`
                    }
                }
                else {
                    timeString = `Next class in..\n 0${hours} h: ${minutes} m: ${seconds} s`
                }

            }
            else {
                timeString = `Next class in..\n ${hours} h: ${minutes} m: ${seconds} s`
            }
        }
        return (
            <div className="timer">
                { days === 0 ?
                    <h1 style={{
                        textAlign: "center",
                        fontSize: "21px",
                        paddingTop: "6px"
                    }}>{timeString}</h1> : ""
                }
            </div>
        )
    }
};
