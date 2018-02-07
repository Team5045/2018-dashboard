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
for (var it in lpath) {
    path = lpath[it];
    path.style.fill = "#222";
}
for (var it in rpath) {
    path = rpath[it];
    path.style.fill = "#222";
}
NetworkTables.addKeyListener('/robot/driver/AButton', (key, value) => {
    if (value){
        lpath[13].style.fill='#FFF';
    }
    else {
        lpath[13].style.fill='#222';        
    }
});
NetworkTables.addKeyListener('/robot/driver/BButton', (key, value) => {
    if (value){
        lpath[15].style.fill='#FFF';
    }
    else {
        lpath[15].style.fill='#222';        
    }
});
NetworkTables.addKeyListener('/robot/driver/XButton', (key, value) => {
    if (value){
        lpath[12].style.fill='#FFF';
    }
    else {
        lpath[12].style.fill='#222';        
    }
});
NetworkTables.addKeyListener('/robot/driver/YButton', (key, value) => {
    if (value){
        lpath[14].style.fill='#FFF';
    }
    else {
        lpath[14].style.fill='#222';        
    }
});
NetworkTables.addKeyListener('/robot/driver/BackButton', (key, value) => {
    if (value){
        lpath[7].style.fill='#FFF';
    }
    else {
        lpath[7].style.fill='#222';        
    }
});
NetworkTables.addKeyListener('/robot/driver/StartButton', (key, value) => {
    if (value){
        lpath[9].style.fill='#FFF';
    }
    else {
        lpath[9].style.fill='#222';        
    }
});

NetworkTables.addKeyListener('/robot/operator/AButton', (key, value) => {
    if (value){
        rpath[13].style.fill='#FFF';
    }
    else {
        rpath[13].style.fill='#222';        
    }
});
NetworkTables.addKeyListener('/robot/operator/BButton', (key, value) => {
    if (value){
        rpath[15].style.fill='#FFF';
    }
    else {
        rpath[15].style.fill='#222';        
    }
});
NetworkTables.addKeyListener('/robot/operator/XButton', (key, value) => {
    if (value){
        rpath[12].style.fill='#FFF';
    }
    else {
        rpath[12].style.fill='#222';        
    }
});
NetworkTables.addKeyListener('/robot/operator/YButton', (key, value) => {
    if (value){
        rpath[14].style.fill='#FFF';
    }
    else {
        rpath[14].style.fill='#222';        
    }
});
NetworkTables.addKeyListener('/robot/operator/BackButton', (key, value) => {
    if (value){
        rpath[7].style.fill='#FFF';
    }
    else {
        rpath[7].style.fill='#222';        
    }
});
NetworkTables.addKeyListener('/robot/operator/StartButton', (key, value) => {
    if (value){
        rpath[9].style.fill='#FFF';
    }
    else {
        rpath[9].style.fill='#222';        
    }
});