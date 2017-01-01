ctx_temp.lineJoin = 'round';
ctx_temp.lineCap = 'round';
ctx_temp.strokeStyle = '#000';
ctx_temp.fillStyle = '#000';
ctx1.lineJoin = 'round';
ctx1.lineCap = 'round';
ctx1.strokeStyle = '#000';
ctx1.fillStyle = '#000';

var MainWidth = $('#myCanvas').width();

var lineWidth = function (width) {
    ctx1.lineWidth = width;

};

var lineWidth_temp = function (width) {
    ctx_temp.lineWidth = width;
};

//确认谁来画
socket.on('whoPaint',function (i) {
    btnDown = i;
});



//自己画
btn.onclick = function () {
    btnDown = 1;
    socket.emit('iPaint',btnDown);
    lineWidth(5);
    lineWidth_temp(5);
}

//清空画布
clear.onclick = function () {
    ctx1.clearRect(0,0,3000,3000);
    ctx1.beginPath();
    socket.emit('clearPoint',1);
}

var point = [];
var pointNum = 0;

var paintSmoothLine = function (ppt) {

    ctx1.beginPath();

    ctx1.moveTo(ppt[0].x, ppt[0].y);

    for (var i = 1; i < ppt.length - 2; i++) {
        var c = (ppt[i].x + ppt[i + 1].x) / 2;
        var d = (ppt[i].y + ppt[i + 1].y) / 2;

        ctx1.quadraticCurveTo(ppt[i].x, ppt[i].y, c, d);
    }

    ctx1.stroke();

};

//鼠标按下
myCanvasTemp.onmousedown = function (e) {
    var x = e.clientX;
    var y = e.clientY;
    x -= c.offsetLeft;
    y -= c.offsetTop;

    ctx_temp.beginPath();
    ctx_temp.moveTo(x,y);

    point[pointNum++] = {x:x,y:y};

    temp = 1;
    //第三个参数判断鼠标按下(表示需要重新计算起点
    socket.emit('sendPoint_temp',x,y,1,$('#myCanvas').width());
};

//鼠标移动
myCanvasTemp.onmousemove = function (e) {
    var x = e.clientX;
    var y = e.clientY;
    x -= c.offsetLeft;
    y -= c.offsetTop;

    if(temp == 1 && btnDown == 1){
        ctx_temp.lineTo(x,y);
        point[pointNum++] = {x: x, y: y};
        socket.emit('sendPoint_temp',x,y,0,$('#myCanvas').width());
        ctx_temp.stroke();
    }
};

//鼠标松开
myCanvasTemp.onmouseup = function () {
    temp = 0;
    ctx_temp.clearRect(0,0,3000,3000);
    paintSmoothLine(point);
    socket.emit('sendPoint',point,0,$('#myCanvas').width());
    pointNum = 0;
    point = [];


};

//鼠标离开画布
myCanvasTemp.onmouseout=function(){
    temp = 0;
    ctx_temp.clearRect(0,0,3000,3000);
    paintSmoothLine(point);
    socket.emit('sendPoint',point,0,$('#myCanvas').width());
    pointNum = 0;
    point = [];
};


//手指按下
myCanvasTemp.addEventListener("touchstart", function(e) {
    //禁止手机滚动
    this.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, false);

    lineWidth(1);
    lineWidth_temp(1);

    var x = e.touches[0].pageX;
    var y = e.touches[0].pageY;
    x -= c.offsetLeft;
    y -= c.offsetTop;
    ctx_temp.beginPath();
    ctx_temp.moveTo(x,y);
    point[pointNum++] = {x:x,y:y};
    socket.emit('sendPoint_temp',x,y,0,$('#myCanvas').width());
    temp = 1;

});

//手指滑动
myCanvasTemp.addEventListener("touchmove", function(e) {
    var x = e.touches[0].pageX;
    var y = e.touches[0].pageY;
    x -= c.offsetLeft;
    y -= c.offsetTop;

    if(temp == 1 && btnDown == 1){
        ctx_temp.lineTo(x,y);
        point[pointNum++] = {x: x, y: y};
        socket.emit('sendPoint_temp',x,y,0,$('#myCanvas').width());
        ctx_temp.stroke();
    }
});

//手指离开
myCanvasTemp.addEventListener("touchend", function(e) {
    temp = 0;
    ctx_temp.clearRect(0,0,3000,3000);
    paintSmoothLine(point);
    socket.emit('sendPoint',point,0,$('#myCanvas').width());
    pointNum = 0;
    point = [];
});


// socket.on('getPoint',function (x,y) {
//     console.log(x + ' ' + y);
// });