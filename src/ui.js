var table = document.getElementById("mytable");
var timer = document.getElementById("timer");
var autoSelect = document.getElementById("autoSelect");

var lpath = [
    document.getElementById('lpath1'),
    document.getElementById('lpath2'),
    document.getElementById('lpath3'),
    document.getElementById('lpath4'), //rstick
    document.getElementById('lpath5'),
    document.getElementById('lpath6'),
    document.getElementById('lpath7'),
    document.getElementById('lpath8'), //back
    document.getElementById('lpath9'),
    document.getElementById('lpath10'), //start
    document.getElementById('lpath11'), //lstick
    document.getElementById('lpath12'),
    document.getElementById('lpath13'), //x
    document.getElementById('lpath14'), //a
    document.getElementById('lpath15'), //y
    document.getElementById('lpath16') //b
];
var rpath = [
    document.getElementById('rpath1'),
    document.getElementById('rpath2'),
    document.getElementById('rpath3'),
    document.getElementById('rpath4'), //rstick
    document.getElementById('rpath5'),
    document.getElementById('rpath6'),
    document.getElementById('rpath7'),
    document.getElementById('rpath8'), //back
    document.getElementById('rpath9'),
    document.getElementById('rpath10'), //start
    document.getElementById('rpath11'), //lstick
    document.getElementById('rpath12'),
    document.getElementById('rpath13'), //x
    document.getElementById('rpath14'), //a
    document.getElementById('rpath15'), //y
    document.getElementById('rpath16') //b
];
var dictionary = {};
var pids = {};
NetworkTables.addKeyListener('/robot/time', (key, value) => {
    // This is an example of how a dashboard could display the remaining time in a match.
    // We assume here that value is an integer representing the number of seconds left.
    timer.innerHTML = value < 0 ? '0:00' : Math.floor(value / 60) + ':' + (value % 60 < 10 ? '0' : '') + value % 60;
});

// Load list of prewritten autonomous modes
NetworkTables.addKeyListener('/SmartDashboard/Autonomous Mode/options', (key, value) => {
    // Clear previous list
    while (autoSelect.firstChild) {
        autoSelect.removeChild(autoSelect.firstChild);
    }
    // Make an option for each autonomous mode and put it in the selector
    for (let i = 0; i < value.length; i++) {
        var option = document.createElement('option');
        option.appendChild(document.createTextNode(value[i]));
        autoSelect.appendChild(option);
    }
    // Set value to the already-selected mode. If there is none, nothing will happen.
    autoSelect.value = NetworkTables.getValue('/SmartDashboard/currentlySelectedMode');
});
// Load list of prewritten autonomous modes
NetworkTables.addKeyListener('/SmartDashboard/Autonomous Mode/selected', (key, value) => {
    autoSelect.value = value;
});
// Update NetworkTables when autonomous selector is changed
autoSelect.onchange = function() {
    NetworkTables.putValue('/SmartDashboard/Autonomous Mode/selected', this.value);
};

for (var it in lpath) {
    path = lpath[it];
    path.setAttribute("fill", "#222");
}
for (var it in rpath) {
    path = rpath[it];
    path.setAttribute("fill", "#222");
}

NetworkTables.addGlobalListener(function(key, value, isNew){
    if (isNew) {
        var row = table.insertRow();
        row.id = key;
        var c0 = row.insertCell(0);
        var c1 = row.insertCell(1);
        var c2 = row.insertCell(2);
        c0.textContent = key;
        c1.textContent = typeof value;
        c2.textContent = value;
        if (['kP','kI','kD','kH'].includes(key.slice(-2))) {
            pids[key.slice(0,-2)] = {
                'value':1,
                'setpoint':1,
                'error':1,
            };
            console.log(pids)
        }
        }
    else {
        var row = document.getElementById(key);
        row.cells[2].textContent = value;
    }
});
var data;
var options = {
    scales: {
        xAxes: [{
            ticks: {
                display: true,
                fontColor: "#FFF"
            }
        }],
        yAxes: [{
            ticks: {
                display: true,  
                fontColor: "#FFF"
            }
        }]
    }
};
var ctx = document.getElementById("myChart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
});

setInterval(function(){
    for (var i in Object.keys(pids)) {
        pids[i] = {
            'value': NetworkTables.getValue(i+'value'),
            'setpoint': NetworkTables.getValue(i+'setpoint'),
            'error': NetworkTables.getValue(i+'error')
        }
    }
}, 1);