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
NetworkTables.addGlobalListener(function(key, value, isNew){
    for (var value in NetworkTables.getKeys()) {
        dictionary[NetworkTables.getKeys()[value]] = NetworkTables.getValue(NetworkTables.getKeys()[value]);
    }
    for (var i in dictionary) {
        var values = [];
        var pos = {};
        for (var j in table.rows) {
            if (table.rows[j].cells) {
                values.push(table.rows[j].cells[0].innerHTML);
                pos[table.rows[j].cells[0].innerHTML] = parseInt(j);
            }
        }
        if (! values.includes(i)) {
            var row = table.insertRow();
            var cell0 = row.insertCell(0);
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);
            cell0.innerHTML = i;
            cell1.innerHTML = String(typeof dictionary[i]);
            cell2.innerHTML = dictionary[i];
            cell2.contentEditable = true;
            cell2.addEventListener('blur', function(){
                NetworkTables.putValue(i,cell2.innerHTML)
             });
        }
        else {
            table.rows[pos[i]].cells[2].innerHTML = dictionary[i];        
        }
        if (values.includes('/robot/driver/AButton')){
            if (dictionary['/robot/driver/AButton']){
                lpath[13].setAttribute("fill", "white");                
            }
            else {
                lpath[13].setAttribute("fill", "#222");                
            }
            if (dictionary['/robot/driver/BButton']){
                lpath[15].setAttribute("fill", "white");
            }
            else {
                lpath[15].setAttribute("fill", "#222");
            }
            if (dictionary['/robot/driver/BackButton']){
                lpath[7].setAttribute("fill", "white");
            }
            else {
                lpath[7].setAttribute("fill", "#222");
            }
            if (dictionary['/robot/driver/StartButton']){
                lpath[9].setAttribute("fill", "white");
            }
            else {
                lpath[9].setAttribute("fill", "#222");
            }
            if (dictionary['/robot/driver/XButton']){
                lpath[12].setAttribute("fill", "white");
            }
            else {
                lpath[12].setAttribute("fill", "#222");
            }
            if (dictionary['/robot/driver/YButton']){
                lpath[14].setAttribute("fill", "white");
            }
            else {
                lpath[14].setAttribute("fill", "#222");
            }

            if (dictionary['/robot/operator/AButton']){
                rpath[13].setAttribute("fill", "white");                
            }
            else {
                rpath[13].setAttribute("fill", "#222");                
            }
            if (dictionary['/robot/operator/BButton']){
                rpath[15].setAttribute("fill", "white");
            }
            else {
                rpath[15].setAttribute("fill", "#222");
            }
            if (dictionary['/robot/operator/BackButton']){
                rpath[7].setAttribute("fill", "white");
            }
            else {
                rpath[7].setAttribute("fill", "#222");
            }
            if (dictionary['/robot/operator/StartButton']){
                rpath[9].setAttribute("fill", "white");
            }
            else {
                rpath[9].setAttribute("fill", "#222");
            }
            if (dictionary['/robot/operator/XButton']){
                rpath[12].setAttribute("fill", "white");
            }
            else {
                rpath[12].setAttribute("fill", "#222");
            }
            if (dictionary['/robot/operator/YButton']){
                rpath[14].setAttribute("fill", "white");
            }
            else {
                rpath[14].setAttribute("fill", "#222");
            }
        }
        
    }
}, true);

for (var it in lpath) {
    path = lpath[it];
    path.setAttribute("fill", "#222");
}
for (var it in rpath) {
    path = rpath[it];
    path.setAttribute("fill", "#222");
}