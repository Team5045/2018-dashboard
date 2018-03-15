let address = document.getElementById('connect-address'),
connect = document.getElementById('connect');

// Set function to be called on NetworkTables connect. Not implemented.
//NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);

// Set function to be called when robot dis/connects
NetworkTables.addRobotConnectionListener(onRobotConnection, false);

// Sets function to be called when any NetworkTables key/value changes
//NetworkTables.addGlobalListener(onValueChanged, true);

/**
* Function to be called when robot connects
* @param {boolean} connected
*/
function onRobotConnection(connected) {
var state = connected ? 'Robot connected!' : 'Robot disconnected.';
console.log(state);
if (connected) {
    // On connect hide the connect popup
    document.getElementById('login').style.display='none';
    document.body.classList.toggle('login', false);
    while (document.getElementById('graph').firstChild) {
        document.getElementById('graph').removeChild(document.getElementById('graph').firstChild);
    }
    document.getElementById("graph").backgroundColor = '#222';
    document.getElementById("graph").classList.remove('graph');
    document.getElementById("graph").classList.add('video');
        $( ".tunable" ).css({
            'grid-column': '1 / 13',
            'grid-row': '6 / 26'  
        });
        $( "#graph" ).css({
            'grid-column': '13 / 34',
            'grid-row': '1 / 26'  
        });
        $('.title').css({
            'display': 'none'
        });
        $('.timer').css({
            'display': 'grid',
            'grid-column': '1 / 13',
            'grid-row': '1 / 4',
            'font-size': '150%'
        });
        $('.auto').css({
            'display': 'block',
            'grid-column': '1 / 13',
            'grid-row': '4 / 6'
        });
        $('.auton').css({
                
        });
        var gyron = document.getElementById('gyron');
        var gyronum = document.getElementById('gyro-number');
        var g1 = document.getElementById('g1');
        var g2 = document.getElementById('g2');
        var rect = gyron.getBoundingClientRect();
        var gx = (rect.right-rect.left)/2;
        var gy = (rect.bottom-rect.top)/2;
        var gr = Math.sqrt(gx*gx + gy*gy)/4;
        g1.setAttribute('cx', gx);
        g1.setAttribute('cy', gy);
        g1.setAttribute('r', gr);
        g2.setAttribute('cx', gx);
        g2.setAttribute('cy', gy);
        gyronum.setAttribute('x', gx+30);
        gyronum .setAttribute('y', gy+30);
        $('.settings').css({
            'display': 'none'
        });
        mode2 = 'q';
        lineChart.update(0);
}
else {
    // On disconnect show the connect popup
    document.getElementById('login').style.display='';    
    document.body.classList.toggle('login', true);
    // Add Enter key handler
    address.onkeydown = ev => {
        if (ev.key === 'Enter') connect.click();
    };
    var rowcount = document.getElementById('mytable').rows.length;
    var optcount = document.getElementById('autoSelect').children.length;
    // Enable the input and the button
    address.disabled = connect.disabled = false;
    connect.textContent = 'Connect';
    // Add the default address and select xxxx
    address.value = '10.50.45.2';
    address.focus();
    // On click try to connect and disable the input and the button
    connect.onclick = () => {
        ipc.send('connect', address.value);
        address.disabled = connect.disabled = true;
        connect.textContent = 'Connecting...';
    };
    if (optcount>0){
    const remote = require('electron').remote;
    remote.app.relaunch();
    remote.app.exit(0);}
}   
}