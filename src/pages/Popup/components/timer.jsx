import React, { Component } from "react";
import './stylingtimer.css';

// function method() {
//     return 1602239900000;

// }

// function coolio(date) {
//     var myDate = new Date(date);
//     var offset = myDate.getTimezoneOffset() * 60 * 1000;

//     var withOffset = myDate.getTime();
//     var withoutOffset = withOffset - offset;
//     console.log(withoutOffset - 19800000);
//     return (withoutOffset - 19800000)
// }

// function extract() {
//     timeMethod()
//         .then(function (response) {
//             console.log(response.data);
//             console.log("suxy");
//             return response;
//         })

// }

// let res = extract();
// console.log();

// async function timeMethod() {
//     let data = await getAllDataFromStorage();
//     var alarms = await new Promise((resolve) => chrome.alarms.getAll(resolve));
//     alarms.sort(function (a, b) {
//         return a.scheduledTime - b.scheduledTime;
//     });
//     return alarms;

// var setalarms = [];

// for (let i = 0; i < alarms.length; i++) {
//     var time = new Date();
//     time.setTime(alarms[i].scheduledTime);
//     time = time.toLocaleString();
//     setalarms.push({
//         time: time,
//         id: i,
//         name: alarms[i].name,
//         data: data[alarms[i].name].course,
//         status: data[alarms[i].name].status,
//         custom: data[alarms[i].name].course.type === 'custom',
//     });
// }


// var v = {};
// timeMethod().then(function (val) {

// })
// console.log(v);
// function extract(timeMethod) {
//     timeMethod().then(function (result) {
//         return result;
//     });
// }

// var v = extract(timeMethod);
// console.log(v);

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
                clearInterval(this.myInterval);
            }
        }, 1000)
    }


    componentWillUnmount() {
        clearInterval(this.myInterval);
    };

    render() {

        const { remTime } = this.state;
        var hours = Math.floor(remTime / 3600000);
        var minutes = Math.floor(remTime / 60000);
        if (minutes >= 60) {
            hours += Math.floor(minutes / 60)
            minutes = minutes % 60
        }
        var seconds = ((remTime % 60000) / 1000).toFixed(0);
        // return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        var timeString = ""
        if (hours >= 10) {
            timeString = "chill Abhi time Hai 😎"
        } else {
            if (minutes < 10) {
                if (seconds < 10) {
                    timeString = "Next class in.. 0" + hours + " h: 0" + minutes + " m: 0" + seconds + " s"
                }
                else {
                    timeString = "Next class in.. 0" + hours + " h: 0" + minutes + " m: " + seconds + " s"
                }
            }
            else {
                timeString = "Next class in.. 0" + hours + " h: " + minutes + " m: " + seconds + " s"
            }
        }
        return (
            <div className="timer">

                <h1 style={{
                    textAlign: "center",
                    fontSize: "21px"
                }}>{timeString}</h1>

            </div>
        )
    }
};
