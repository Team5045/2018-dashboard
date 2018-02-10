var table = document.getElementById("mytable");
var errorData = [];
var setpointData = [];
var valueData = [];
var pids = [];
var j = 0;
var start = Date.now();

function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last,
      deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date,
        args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}
function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
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
                fill: false,
                pointRadius: 0
            },
            {
                label: "Setpoint",
                borderColor	: 'grey', 
                backgroundColor	: 'grey', 
                data: setpointData,
                fill: false,
                pointRadius: 0
            },
            {
                label: "Value",
                borderColor	: 'black',
                backgroundColor	: 'black',
                data: valueData,
                fill: false,
                pointRadius: 0
            }
        ]
    },
    options: {
        animation: {
            duration: 0,
        },
        hover: {
            animationDuration: 0,
        },
        responsiveAnimationDuration: 0,
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom'
            }]
        }
    }
});
document.getElementById("clear").addEventListener("click", function( event ) {
    errorData = [];
    setpointData = [];
    valueData = [];
    lineChart.config.data = {
        datasets:[
            {
                label: "Error",
                borderColor	: 'red', 
                backgroundColor	: 'red', 
                data: errorData,
                fill: false,
                pointRadius: 0
            },
            {
                label: "Setpoint",
                borderColor	: 'grey',
                backgroundColor	: 'grey',                 
                data: setpointData,
                fill: false,
                pointRadius: 0
            },
            {
                label: "Value",
                borderColor	: 'black',
                backgroundColor	: 'black',
                data: valueData,
                fill: false,
                pointRadius: 0
            }
        ]
    }
    lineChart.update(0);
    console.log()
}, false);
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
        if (key.includes('setpoint')) {
            document.getElementById("pids").options.length = 0;            
            pids.push(key.split('/').slice(0,-1).join('/'));
            pids = uniq(pids);
            pids.forEach(function(i){
                var option = document.createElement('option');
                option.appendChild(document.createTextNode(i));
                document.getElementById("pids").appendChild(option);        
            });
            var option = document.createElement('option');
            option.appendChild(document.createTextNode('Limelight'));
            document.getElementById("pids").appendChild(option);        
        }
        else if (key.includes('value')) {
            document.getElementById("pids").options.length = 0;                        
            pids.push(key.split('/').slice(0,-1).join('/'));
            pids = uniq(pids);
            pids.forEach(function(i){
                var option = document.createElement('option');
                option.appendChild(document.createTextNode(i));
                document.getElementById("pids").appendChild(option);
            });
            var option = document.createElement('option');
            option.appendChild(document.createTextNode('Limelight'));
            document.getElementById("pids").appendChild(option);        
        }
        else if  (key.includes('error')) {
            document.getElementById("pids").options.length = 0;            
            pids.push(key.split('/').slice(0,-1).join('/'));
            pids = uniq(pids);
            pids.forEach(function(i){
                var option = document.createElement('option');
                option.appendChild(document.createTextNode(i));
                document.getElementById("pids").appendChild(option);      
            });
            var option = document.createElement('option');
            option.appendChild(document.createTextNode('Limelight'));
            document.getElementById("pids").appendChild(option);
        }
    }
    else {
        var row = document.getElementById(key);
        row.cells[2].textContent = value;
        var i = key.split('/').slice(-1).join('/');
        if (pids.includes(key.split('/').slice(0,-1).join('/'))){
            if (['value','setpoint','error'].includes(i)) {
                if (i=='value'){
                    valueData.push({
                        y: value,
                        x: (Date.now()-start)
                    });
                    if (valueData.length>250){
                        errorData = errorData.slice(250, -1);
                        setpointData = setpointData.slice(250, -1);
                        valueData = valueData.slice(250, -1);                    
                    }
                }
                else if (i=='error'){
                    errorData.push({
                        y: value,
                        x: (Date.now()-start)
                    });
                    if (errorData.length>250){
                        errorData = errorData.slice(250, -1);
                        setpointData = setpointData.slice(250, -1);
                        valueData = valueData.slice(250, -1);                    
                    }
                }
                setpointData.push({
                    y: NetworkTables.getValue(key.split('/').slice(0,-1).join('/')+'/setpoint'),          
                    x: (Date.now()-start)
                });
                if (setpointData.length>250){
                    errorData = errorData.slice(250, -1);
                    setpointData = setpointData.slice(250, -1);
                    valueData = valueData.slice(250, -1);                    
                }
            lineChart.config.data = {
                datasets:[
                    {
                        label: "Error",
                        borderColor	: 'red', 
                        backgroundColor	: 'red', 
                        data: errorData,
                        fill: false,
                        pointRadius: 0
                    },
                    {
                        label: "Setpoint",
                        borderColor	: 'grey',
                        backgroundColor	: 'grey',                 
                        data: setpointData,
                         fill: false,
                         pointRadius: 0
                    },
                    {
                        label: "Value",
                        borderColor	: 'black',
                        backgroundColor	: 'black',
                        data: valueData,
                        fill: false,
                        pointRadius: 0
                    }
                ]
            }
            lineChart.update(10);
            }
    
            }
        }
});