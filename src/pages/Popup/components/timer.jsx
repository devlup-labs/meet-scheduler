import React, { Component } from "react";
class Timer extends Component {
    today = new Date();
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
            remTime: this.today
        }
    }

    async componentDidMount() {
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
    
    toggleHover() {
        this.setState({hover: !this.state.hover})
    }

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
        var timeString = ""
        if (days > 0) {
            if (hours < 10) {
                if (minutes < 10) {
                    if (seconds < 10) {
                        timeString = `NEXT MEET IN\n ${days} d: 0${hours} h: 0${minutes} m: 0${seconds} s`
                    }
                    else {
                        timeString = `NEXT MEET IN\n ${days} d: 0${hours} h: 0${minutes} m: ${seconds} s`
                    }
                }
                else {
                    timeString = `NEXT MEET IN\n ${days} d: 0${hours} h: ${minutes} m: ${seconds} s`
                }

            }
            else {
                timeString = `NEXT MEET IN\n ${days} d: ${hours} h: ${minutes} m: ${seconds} s`
            }
        } else {
            if (hours < 10) {
                if (minutes < 10) {
                    if (seconds < 10) {
                        timeString = `NEXT MEET IN\n 0${hours} h: 0${minutes} m: 0${seconds} s`
                    }
                    else {
                        timeString = `NEXT MEET IN\n 0${hours} h: 0${minutes} m: ${seconds} s`
                    }
                }
                else {
                    timeString = `NEXT MEET IN\n 0${hours} h: ${minutes} m: ${seconds} s`
                }

            }
            else {
                timeString = `NEXT MEET IN\n ${hours} h: ${minutes} m: ${seconds} s`
            }
        }
        return (
            <div>
                { days === 0 ?
                    <h2 style = {{
                        fontSize: '0.950rem',
                        fontFamily: '"Helvetica", "Arial", sans-serif',
                        fontWeight: '600',
                        lineHeight: '1.75',
                        borderRadius: '4px',
                        letterSpacing: '0.02857em',
                        textAlign: 'center',
                        marginBottom: '0px'
                    }}> {timeString} </h2>
                    : ""
                }
            </div>
        )
    }
};
export default Timer;
