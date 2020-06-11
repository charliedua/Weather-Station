var interval_id = "NULL";
var myChart;
var myChart1;
var myChart2;

var _start_datetime;
var _end_datetime;

function getData(start_datetime, end_datetime) {
    _start_datetime = start_datetime;
    _end_datetime = end_datetime;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);
            var data = JSON.parse(this.responseText);
            if (data.length > 0) {
                var lights_n_date = [];
                var temp_n_date = [];
                var temp2_n_date = [];
                var humidities_n_date = [];
                var mean_n_date = [];
                var MaxTemp = -100;
                var MinTemp = Infinity;

                var HumidSum = 0;
                var MaxHumid = -100;
                var MinHumid = Infinity;

                // var mean_total_n_date = [];
                // var mean_total_input = 0;
                // var mean_total_n_date2 = [];
                // var mean_total_input2 = 0;

                // var variance_total_input = 0;
                // var variance_total_n_date = [];
                // var variance_total_input2 = 0;
                // var variance_total_n_date2 = [];

                // var stddev_total_n_date = [];
                // var stddev_total_input = 0;
                // var stddev_total_n_date2 = [];
                // var stddev_total_input2 = 0;

                for (let i = 0; i < data.length; i++) {
                    lights_n_date.push({
                        x: (new Date(data[i][5])),
                        y: data[i][1]
                    });
                    temp_n_date.push({
                        x: (new Date(data[i][5])),
                        y: data[i][2]
                    });
                    temp2_n_date.push({
                        x: (new Date(data[i][5])),
                        y: data[i][3]
                    });

                    humidities_n_date.push({
                        x: (new Date(data[i][5])),
                        y: data[i][4]
                    });

                    var curr_avg_temp = (data[i][2] + data[i][3]) / 2;

                    mean_n_date.push({
                        x: (new Date(data[i][5])),
                        y: curr_avg_temp
                    });

                    if (MaxTemp < curr_avg_temp) {
                        MaxTemp = curr_avg_temp;
                    }

                    if (MinTemp > curr_avg_temp) {
                        MinTemp = curr_avg_temp
                    }

                    var curr_Humid = data[i][4];
                    HumidSum += curr_Humid;
                    if (MaxHumid < curr_Humid) {
                        MaxHumid = curr_Humid;
                    }

                    if (MinHumid > curr_Humid) {
                        MinHumid = curr_Humid
                    }
                }

                // Calculate mean total.
                // for (let i = 0; i < data.length; i++) {
                //     mean_total_input += data[i][2];
                //     mean_total_input2 += data[i][3];
                // }

                // mean_total_input /= data.length;
                // mean_total_input2 /= data.length;

                var cells = document.querySelectorAll("#Stats_Table tbody td");

                var averageTemp = mean_n_date.reduce((a, b) => a + b.y, 0) / mean_n_date.length;

                cells[0].textContent = averageTemp.toFixed(2);
                cells[1].textContent = MaxTemp.toFixed(2);
                cells[2].textContent = MinTemp.toFixed(2);
                cells[5].textContent = (HumidSum / data.length).toFixed(2);
                cells[6].textContent = MaxHumid;
                cells[7].textContent = MinHumid;
                // Start and end points for total means, so a line gets drawn across the graph.
                // mean_total_n_date.push({
                //     x: (new Date(data[0][5])),
                //     y: mean_total_input
                // });
                // mean_total_n_date.push({
                //     x: (new Date(data[data.length - 1][5])),
                //     y: mean_total_input
                // });
                // mean_total_n_date2.push({
                //     x: (new Date(data[0][5])),
                //     y: mean_total_input2
                // });
                // mean_total_n_date2.push({
                //     x: (new Date(data[data.length - 1][5])),
                //     y: mean_total_input2
                // });
                var Variance = 0;
                // Calculating variance. Each difference, squared, then averaged.
                for (let i = 0; i < data.length; i++) {
                    Variance += Math.pow(mean_n_date[i].y - averageTemp, 2);
                }
                Variance = Variance / data.length;
                cells[3].textContent = Variance.toFixed(2);
                // for (let i = 0; i < data.length; i++) {
                //     variance_total_input += Math.pow(data[i][2] - mean_total_input, 2);
                //     variance_total_input2 += Math.pow(data[i][3] - mean_total_input2, 2);
                // }
                // variance_total_input = variance_total_input / data.length;
                // variance_total_input2 = variance_total_input2 / data.length;

                // variance_total_n_date.push({
                //     x: (new Date(data[0][5])),
                //     y: variance_total_input
                // });
                // variance_total_n_date.push({
                //     x: (new Date(data[data.length - 1][5])),
                //     y: variance_total_input
                // });

                // variance_total_n_date2.push({
                //     x: (new Date(data[0][5])),
                //     y: variance_total_input2
                // });
                // variance_total_n_date2.push({
                //     x: (new Date(data[data.length - 1][5])),
                //     y: variance_total_input2
                // });


                // Calculating standard dev.
                // Square root of the variance.
                var StandardDeviation = Math.sqrt(Variance);
                cells[4].textContent = StandardDeviation.toFixed(2);
                // stddev_total_input = Math.sqrt(variance_total_input);
                // stddev_total_input2 = Math.sqrt(variance_total_input2);

                // stddev_total_n_date.push({
                //     x: (new Date(data[0][5])),
                //     y: stddev_total_input
                // });
                // stddev_total_n_date.push({
                //     x: (new Date(data[data.length - 1][5])),
                //     y: stddev_total_input
                // });
                // stddev_total_n_date2.push({
                //     x: (new Date(data[0][5])),
                //     y: stddev_total_input2
                // });
                // stddev_total_n_date2.push({
                //     x: (new Date(data[data.length - 1][5])),
                //     y: stddev_total_input2
                // });

                //var sum = myChart.data.datasets[0].data.reduce((a, b) => a + b.y, 0)

                myChart.data.datasets[0].data = temp_n_date;
                myChart.data.datasets[1].data = temp2_n_date;
                myChart.data.datasets[2].data = mean_n_date;
                // myChart.data.datasets[3].data = mean_total_n_date;
                // myChart.data.datasets[4].data = mean_total_n_date2;
                // myChart.data.datasets[5].data = variance_total_n_date;
                // myChart.data.datasets[6].data = variance_total_n_date2;
                // myChart.data.datasets[7].data = stddev_total_n_date;
                // myChart.data.datasets[8].data = stddev_total_n_date2;
                myChart.update();
                myChart.resetZoom();

                myChart1.data.datasets[0].data = humidities_n_date;
                myChart1.update();
                myChart1.resetZoom();

                myChart2.data.datasets[0].data = lights_n_date;
                myChart2.update();
                myChart2.resetZoom();

            }
        }
    }
    // console.log(start_datetime, end_datetime)
    xmlhttp.open("GET", "http://14.201.129.240:5000/logs/getData?start_datetime=" + start_datetime + "&end_datetime=" + end_datetime, true);
    xmlhttp.send();
}

function main() {
    var form = document.getElementById("main");
    form.onsubmit = (e) => {
        e.preventDefault();
        start_date = document.getElementById("start_date").value;
        start_time = document.getElementById("start_time").value;
        end_date = document.getElementById("end_date").value;
        end_time = document.getElementById("end_time").value;

        end_date = end_date.length == 0 ? (new Date()).toLocaleDateString().split('/').join('-') : end_date;
        start_date = start_date.length == 0 ? (new Date()).toLocaleDateString().split('/').join('-') : start_date;

        end_time = end_time.length == 0 ? "23:59:59.999" : end_time;
        start_time = start_time.length == 0 ? "00:00:00.000" : start_time;

        end_time = end_time.length == 5 ? end_time + ":00" : end_time;
        start_time = start_time.length == 5 ? start_time + ":00" : start_time;
        getData(start_date + " " + start_time, end_date + " " + end_time);
    }

    var threshform = document.getElementById("form-thresh");
    threshform.onsubmit = (e) => {
        e.preventDefault();
        var temp_threshold = document.getElementById("temp_threshold").value;
        var humidity_threshold = document.getElementById("humidity_threshold").value;
        var light_threshold = document.getElementById("light_threshold").value;
        var thresh = temp_threshold + ";" + humidity_threshold + ";" + light_threshold;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "http://14.201.129.240:5000/setThreshold?threshold=" + thresh, true);
        xmlhttp.send();
    }

    var ctx = document.getElementById('myTempChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Temperature in C',
                data: [],
                borderColor: "#5f7394",

            },
            {
                label: 'Temperature 2 in C',
                data: [],
                borderColor: "#5f7394"
            },
            {
                label: 'Mean Temperature in C',
                data: [],
                borderColor: "#FF0000"
            },
                // {
                //     label: 'Mean Temperature (total) in C',
                //     data: [],
                //     borderColor: "#F000F0"
                // },
                // {
                //     label: 'Mean Temperature 2 (total) in C',
                //     data: [],
                //     borderColor: "#F000F0"
                // },
                // {
                //     label: 'Temperature Variance.',
                //     data: [],
                //     borderColor: "#5000FF"
                // },
                // {
                //     label: 'Temperature 2 Variance',
                //     data: [],
                //     borderColor: "#5000FF"
                // },
                // {
                //     label: 'Temperature Standard Dev.',
                //     data: [],
                //     borderColor: "#000000"
                // },
                // {
                //     label: 'Temperature 2 Standard Dev.',
                //     data: [],
                //     borderColor: "#000000"
                // }
            ]
        },
        options: {
            elements: {
                point: {
                    radius: 0
                }
            },
            responsive: true,
            scales: {
                xAxes: [{
                    type: 'time',
                }],
            },
            pan: {
                enabled: true,
                mode: "x",
            },
            zoom: {
                enabled: true,
                drag: false,
                mode: "x",
            }
        }
    });

    var ctx = document.getElementById('myHumidChart').getContext('2d');
    myChart1 = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Humidity in %',
                data: [],
                borderColor: "#a77fba",
            }]
        },
        options: {
            elements: {
                point: {
                    radius: 0
                }
            },
            responsive: true,
            scales: {
                xAxes: [{
                    type: 'time',
                }],
            },
            pan: {
                enabled: true,
                mode: "x",
            },
            zoom: {
                enabled: true,
                drag: false,
                mode: "x"
            }
        }
    });

    var ctx = document.getElementById('myLightChart').getContext('2d');
    myChart2 = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Light Intensity bw 0 and 1023',
                data: [],
                borderColor: "#50b56b"
            }]
        },
        options: {
            elements: {
                point: {
                    radius: 0
                }
            },
            responsive: true,
            scales: {
                xAxes: [{
                    type: 'time',
                }],
            },
            pan: {
                enabled: true,
                mode: "x",
            },
            zoom: {
                enabled: true,
                drag: false,
                mode: "x"
            }
        }
    });

    getData((new Date()).toLocaleDateString().split('/').join('-') + " " + "00:00:00.000", (new Date()).toLocaleDateString().split('/').join('-') + " " + new Date().toTimeString().substr(0, 8) + ".000");

    document.getElementById("autorefresh-op-On").addEventListener("click", onAutoRefreshChange);
    document.getElementById("autorefresh-op-Off").addEventListener("click", onAutoRefreshChange);

}

window.onload = main;

function onAutoRefreshChange() {
    if (document.getElementById("autorefresh-op-On").checked) {
        if (interval_id == "NULL") {
            interval_id = setInterval(() => {
                getData(_start_datetime, _end_datetime);
            }, 3000);
        }
    }
    else {
        if (interval_id != "NULL") {
            clearInterval(interval_id);
        }
    }
}