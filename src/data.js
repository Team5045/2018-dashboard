var table = document.getElementById("mytable");
var dataset = {};
var pids = {};
var j = 0;
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
        if (['kP','kI','kD','kH'].includes(key.slice(-2))) {
            pids[key.slice(0,-3)] = {
                'value':1,
                'setpoint':1,
                'error':1,
                'time': Date()
            };
            dataset[key.slice(0,-3)] = {
                'value': [],
                'setpoint': [],
                'error': [],
                'time': []
            }
        }
        }
    else {
        var row = document.getElementById(key);
        row.cells[2].textContent = value;
        var i = key.split('/').slice(0,-1).join('/');
        if (Object.keys(pids).includes(i)) {
            pids[i] = {
                'value': NetworkTables.getValue(i+'value'),
                'setpoint': NetworkTables.getValue(i+'setpoint'),
                'error': NetworkTables.getValue(i+'error')
            }
            dataset[i]['value'].push({
                x:j,
                y:pids[i]['value']
            });
            dataset[i]['setpoint'].push({
                x:j,
                y:pids[i]['setpoint']
            });
            dataset[i]['error'].push({
                x:j,
                y:pids[i]['error']
            });
            j++;
            var scatterChart = new Chart('myChart', {
                type: 'line',
                data: {
                    datasets: dataset['/components/elevator']['value']
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
            scatterChart.update(0);
        }
    }
});
