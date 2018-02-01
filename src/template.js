var table = document.getElementById("mytable");
console.log(table);
for (i=0; i<100; i++){
    row = table.insertRow(i+1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = i;
    cell2.innerHTML = i;
    cell3.innerHTML = i;
}
var time = [02,15];
timecheck();
setInterval(timecheck, 1000);
function timecheck() {
    var time1 = time[0];
    var time2 = time[1];
    if ((String(time[0])).length==1) {
        time1 = '0' + time[0]
    }
    if ((String(time[1])).length==1) {
        time2 = '0' + time[1]
    }
    document.getElementById('timer').innerHTML = time1 + ':' + time2;
    if (time[1]<1 && time[0]>0) {
        time[0] = time[0]-1;
        time[1] = 59;
    }
    else if (time[1]<60 && time[1]>0) {
        time[1] = time[1]-1;
    }
    else if (time = [0,0]) {
        time = [2,15];
    }
}