//服务器及页面部分
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users=[];//保存所有在线用户的昵称
// app.use('/', express.static(__dirname + '/www'));
server.listen(4000);

//socket部分
io.on('connection', function(socket) {
    //--------------画图部分---------------
    //接收并处理客户端发送的事件
    socket.on('sendPoint',function (pArray,state,MainWidth) {
        socket.broadcast.emit('getPoint',pArray,state,MainWidth);
    });

    socket.on('sendPoint_temp',function (x,y,state_temp,MainWidth) {
        socket.broadcast.emit('getPoint_temp',x,y,state_temp,MainWidth);
    });

    //获取"我来画"的请求,其他用户自动转为只能观看的模式
    socket.on('iPaint',function (i) {
        io.emit('whoPaint',1-i);
        socket.emit('whoPaint',i);
    });

    //清空其他客户端画布
    socket.on('clearPoint',function (c) {
        socket.broadcast.emit('allClear',c);
    });

    //传递画笔颜色
    socket.on('penColor',function (c) {
        io.emit('allPenColor',c);
    });

    //--------------聊天部分---------------
    //昵称设置
    socket.on('login', function(nickname) {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname, users.length, 'login');//向所有连接到服务器的客户端发送当前登陆用户的昵称
        };
    });

    //断开连接的事件
    socket.on('disconnect', function() {
        //将断开连接的用户从users中删除
        users.splice(socket.userIndex, 1);
        //通知除自己以外的所有人
        socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
    });

    //接收新消息
    socket.on('postMsg', function(msg) {
        //将消息发送到除自己外的所有用户
        socket.broadcast.emit('newMsg', socket.nickname, msg);
    });
});