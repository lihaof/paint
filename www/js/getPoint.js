// ctx_temp.beginPath();
// ctx1.beginPath();
var ClientWidth = $('.paintBox').width();
console.log(ClientWidth);
socket.on('getPoint_temp',function (x,y,state_temp,MainWidth) {

    var scale_temp = ClientWidth/MainWidth;
    x *= scale_temp;
    y *= scale_temp;

    // console.log(scale);
    // console.log(ClientWidth + ' ' + MainWidth + ' ' + scale_temp);

    if(ClientWidth>=768){
        ctx_temp.lineWidth = 5;
    }
    if(state_temp){//鼠标抬起或离开画布后重新计算坐标
        ctx_temp.moveTo(x,y);
    }
    ctx_temp.lineTo(x,y);
    ctx_temp.stroke();
});

//同步画图
socket.on('getPoint',function (pArray,state,MainWidth) {

    ctx_temp.clearRect(0,0,3000,3000);
    ctx_temp.beginPath();

    //比例系数,根据比例系数确定点的相对位置
    var scale= ClientWidth/MainWidth;
    var point2 = [];
    for(var i=0;i<pArray.length;i++){
        point2[i] = {x:pArray[i].x * scale, y:pArray[i].y * scale};
    }
    if(ClientWidth>=768) {
        ctx1.lineWidth = 5;
    }
    paintSmoothLine(point2);
});

//同步清空
socket.on('allClear',function (c) {
    if(c == 1){
        ctx1.clearRect(0,0,3000,3000);
        ctx1.beginPath();
        ctx_temp.clearRect(0,0,3000,3000);
        ctx_temp.beginPath();
    }
});

//改变画笔颜色
socket.on('allPenColor',function (c) {
    ctx1.beginPath();
    ctx1.strokeStyle = c;

    ctx_temp.beginPath();
    ctx_temp.strokeStyle = c;
});

