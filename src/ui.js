var autoSelect = document.getElementById("autoSelect");
var title = document.getElementById("title");
var timer = document.getElementById('timer');
let ui = {
    gyro: {
        container: document.getElementById('gyro'),
        val: 0,
        offset: 0,
        visualVal: 0,
        arm: document.getElementById('gyro-arm'),
        number: document.getElementById('gyro-number')
    }
};
let updateGyro = (key, value) => {
    ui.gyro.val = value;
    ui.gyro.visualVal = Math.floor(ui.gyro.val - ui.gyro.offset);
    ui.gyro.visualVal %= 360;
    if (ui.gyro.visualVal < 0) {
        ui.gyro.visualVal += 360;
    }
    ui.gyro.arm.style.transform = `rotate(${ui.gyro.visualVal}deg)`;
    ui.gyro.number.innerHTML = ui.gyro.visualVal + 'º';
};
NetworkTables.addKeyListener('/robot/angle', updateGyro);

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
    autoSelect.value = NetworkTables.getValue('/SmartDashboard/Autonomous Mode/default');
    NetworkTables.putValue('/SmartDashboard/Autonomous Mode/selected', autoSelect.value);
});

NetworkTables.addKeyListener('/SmartDashboard/Autonomous Mode/selected', (key, value) => {
    autoSelect.value = value;
});

NetworkTables.addKeyListener('/FMSInfo/MatchNumber', (key, value) => {
    title.innerHTML = 'Match ' + value;
});

NetworkTables.addKeyListener('/robot/time', (key, value) => {
    if (Math.floor(value%60).toString().length==1) {
        var time = '0' + Math.floor(value%60).toString();
    }
    else {
        var time = Math.floor(value%60).toString()
    }
    timer.innerHTML = Math.floor(value/60).toString() + ':' + time;

});

autoSelect.addEventListener('change', function(){
    NetworkTables.putValue('/SmartDashboard/Autonomous Mode/selected', autoSelect.value);
});
