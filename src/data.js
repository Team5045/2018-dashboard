var table = document.getElementById("mytable");
var errorData = [{x:0,y:0}];
var setpointData = [{x:0,y:0}];
var valueData = [{x:0,y:0}];
var j = 0;
var time1 = Date.now();
var time2 = Date.now();
var time3 = Date.now();

function debounce(fn, delay) {
    var timer = null;
    return function() {
        var context = this, args = arguments
        clearTimeout(timer);
        timer = setTimeout(function() {
            fn.apply(context, args);
        },delay);
    };
}
var lineChart = new Chart('myChart', {
    type: 'line',
    data: {
        datasets:[
            {
                label: "Error",
                borderColor	: 'red', 
                backgroundColor	: 'red', 
                data: errorData,
                fill: false
            },
            {
                label: "Setpoint",
                borderColor	: 'grey',
                backgroundColor	: 'grey',                 
                data: setpointData,
                fill: false
            },
            {
                label: "Value",
                borderColor	: 'black',
                backgroundColor	: 'black',
                data: valueData,
                fill: false
            }
        ]
    },
    options: {  
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom'
            }]
        }
    }
});

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
        c2.contentEditable = true;
        c2.addEventListener('blur', function(){
            NetworkTables.putValue(c2.parentElement.id,c2.textContent);
        })
    }
    else {
        var row = document.getElementById(key);
        row.cells[2].textContent = value;
        var i = key.split('/').slice(-1).join('/');
        if (['value','setpoint','error'].includes(i)) {
            if (i=='value'){
                valueData.push({
                    y: value,
                    x: Date.now()-time1+valueData[valueData.length-1].y
                });
                time1 = Date.now()
            }
            else if (i=='setpoint'){
                setpointData.push({
                    y: value,
                    x: Date.now()-time2+setpointData[setpointData.length-1].y
                });
                time2 = Date.now()     
            }
            else if (i=='error'){
                errorData.push({
                    y: value,
                    x: Date.now()-time3+errorData[errorData.length-1].y
                });
                time3 = Date.now()
            }
            lineChart.update(0);
        }
        
    }
});
