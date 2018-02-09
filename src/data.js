var table = document.getElementById("mytable");
var errorData = [{x:0,y:0}];
var setpointData = [{x:0,y:0}];
var valueData = [{x:0,y:0}];
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
                    x: (Date.now()-start)
                });
                if (valueData.length>500){
                    errorData = errorData.slice(500, -1);
                    setpointData = setpointData.slice(500, -1);
                    valueData = valueData.slice(500, -1);                    
                }
            }
            else if (i=='error'){
                errorData.push({
                    y: value,
                    x: (Date.now()-start)
                });
                if (errorData.length>500){
                    errorData = errorData.slice(500, -1);
                    setpointData = setpointData.slice(500, -1);
                    valueData = valueData.slice(500, -1);                    
                }
            }
            setpointData.push({
                y: NetworkTables.getValue(key.split('/').slice(0,-1).join('/')+'/setpoint'),          
                x: (Date.now()-start)
            });
            if (setpointData.length>500){
                errorData = errorData.slice(500, -1);
                setpointData = setpointData.slice(500, -1);
                valueData = valueData.slice(500, -1);                    
            }
        lineChart.config.data = {
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
        }
        lineChart.update(10);
        }
        
    }
});
