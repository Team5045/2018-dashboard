var table = document.getElementById("mytable");
var errorData = [];
var setpointData = [];
var valueData = [];
var pids = [];
var j = 0;
var start = Date.now();
var override = true;
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
        c0.textContent = key;
        c1.textContent = value;
        c1.contentEditable = true;
        c1.addEventListener('blur', function(){
            NetworkTables.putValue(c1.parentElement.id,c1.textContent);
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
        row.cells[1].textContent = value;
        var i = key.split('/').slice(-1).join('/');
        if (pids.includes(key.split('/').slice(0,-1).join('/'))){
            if (['value','setpoint','error'].includes(i)) {
                if (i=='value'){
                    valueData.push({
                        y: value,
                        x: (Date.now()-start)
                    });
                    if (valueData.length>250){
                        if (document.getElementById('error').checked){                        
                        errorData = errorData.slice(250, -1);}
                        setpointData = setpointData.slice(250, -1);
                        valueData = valueData.slice(250, -1);                    
                    }
                }
                else if (i=='error' && document.getElementById('error').checked){
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
                    if (document.getElementById('error').checked){
                        errorData = errorData.slice(250, -1);}
                    setpointData = setpointData.slice(250, -1);
                    valueData = valueData.slice(250, -1);                    
                }
                if (document.getElementById('error').checked){                    
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
                }
                else {                    
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
                };
                lineChart.update(10);
            }
        }
    }
});
document.getElementById("pids").addEventListener('change', function(){
    var selected = document.getElementById('pids').value;
    if (selected=='Limelight'){
        while (document.getElementById('graph').firstChild) {
            document.getElementById('graph').removeChild(document.getElementById('graph').firstChild);
        }
        document.getElementById("graph").backgroundColor = '#222';
        document.getElementById("graph").classList.remove('graph');
        document.getElementById("graph").classList.add('video');
    }
    else {
        if(document.getElementById("graph").classList == 'video'){
            document.getElementById("graph").backgroundColor = '#222';
            document.getElementById("graph").classList.remove('video');
            document.getElementById("graph").classList.add('graph');
    
        var canvas = document.getElementById('graph').appendChild(document.createElement('canvas'));
        canvas.id = 'myChart';
        lineChart = new Chart('myChart', {
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
        
    }
}
});
var mode = '';
var mode2 = 'q';
document.addEventListener('keydown', (event) => {
    if (event.key=='f'){
        while (document.getElementById('graph').firstChild) {
            document.getElementById('graph').removeChild(document.getElementById('graph').firstChild);
        }
        document.getElementById("graph").backgroundColor = '#222';
        document.getElementById("graph").classList.remove('graph');
        document.getElementById("graph").classList.add('video');
        if (mode2!='f') {
            $( ".tunable" ).css({
                'display': 'grid',
                'grid-column': '1 / 13',
                'grid-row': '6 / 26'  
            });
            $( "#graph" ).css({
                'display': 'grid',
                'grid-column': '13 / 34',
                'grid-row': '1 / 26'  
            });
            $('.title').css({
                'display': 'grid',
                'display': 'none'
            });
            $('.timer').css({
                'display': 'grid',
                'grid-column': '1 / 13',
                'grid-row': '1 / 4',
                'font-size': '150%'
            });
            $('.auto').css({
                'display': 'initial',
            });
            $('.auton').css({
                'display': 'block',
                'margin-left': '25%',
                'margin-right': '25%'
            });
            $('.settings').css({
                'display': 'none'
            });
            mode2 = 'f';
            lineChart.update(0);
        }
        else {
            $( ".tunable" ).css({
                'display': 'none',
                'grid-column': '1 / 13',
                'grid-row': '10 / 26'  
            });
            $( "#graph" ).css({
                'grid-column': '1 / 34',
                'grid-row': '1 / 26'  
            });
            $('.title').css({
                'display': 'none'
            });
            $('.timer').css({
                'display': 'none'
            });
            $('.auto').css({
                'display': 'none'
            });
            $('.auton').css({
                'display': 'none'
            });
            $('.settings').css({
                'display': 'none'
            });
            mode2 = '';
            lineChart.update(0);
        }
    }
});
  
  