window.onload = function() {
    //实例并初始化chat程序
    var chat = new Chat();
    chat.init();
};

//定义Chat类
var Chat = function() {
    this.socket = null;
};

//向原型添加业务方法
Chat.prototype = {
    init: function() {//此方法初始化程序
        var that = this;
        //建立到服务器的socket连接
        this.socket = io.connect(window.location.hostname + ':4000');
        //监听socket的connect事件，此事件表示连接已经建立
        this.socket.on('connect', function() {
            //连接到服务器后，显示昵称输入框
            document.getElementById('info').textContent = '输入您的昵称: ';
            document.getElementById('nickWrapper').style.display = 'block';
            document.getElementById('nicknameInput').focus();
        });

        //昵称设置的确定按钮
        document.getElementById('loginBtn').addEventListener('click', function() {
            var nickName = document.getElementById('nicknameInput').value;
            //检查昵称输入框是否为空
            if (nickName.trim().length != 0) {
                //不为空，则发起一个login事件并将输入的昵称发送到服务器
                that.socket.emit('login', nickName);
            } else {
                //否则输入框获得焦点
                document.getElementById('nicknameInput').focus();
            };
        }, false);

        //判断自己的昵称是否重复
        this.socket.on('nickExisted', function() {
            document.getElementById('info').textContent = '昵称已经被占用，请输入其他的'; //显示昵称被占用的提示
        });

        //登录成功进入界面
        this.socket.on('loginSuccess', function() {
            document.title = 'chat | ' + document.getElementById('nicknameInput').value;
            document.getElementById('loginWrapper').style.display = 'none';//隐藏遮罩层显聊天界面
            document.getElementById('messageInput').focus();//让消息输入框获得焦点
        });

        this.socket.on('system', function(nickName, userCount, type) {
            //判断用户是连接还是离开以显示不同的信息
            var msg = nickName + (type == 'login' ? ' joined' : ' left');
            var p = document.createElement('p');
            p.textContent = msg;
            // document.getElementById('historyMsg').appendChild(p);
            //将在线人数显示到页面顶部
            document.getElementById('status').textContent = userCount + (userCount > 1 ? ' 个用户' : ' 个用户') + ' 在线';
            //指定系统消息显示为#ddd
            that._displayNewMsg('system', msg, '#ddd');
            document.getElementById('status').textContent = userCount + (userCount > 1 ? ' 个用户' : ' 个用户') + ' 在线';
        });

        document.getElementById('sendBtn').addEventListener('click', function() {
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value;

            //输入的消息加入弹幕缓冲区
            // playList[barrageNum++] = {
            //     //从何时开始
            //     time:0,
            //     //经过的时间
            //     duration:8000,
            //     //舞台偏移的高度
            //     top:20*(barrageNum+1),
            //     //弹幕文字大小
            //     size:30 + 'px',
            //     //弹幕颜色
            //     color:'#000',
            //     //内容
            //     text: msg
            // };

            // console.log(playList);

            messageInput.value = '';
            messageInput.focus();
            if (msg.trim().length != 0) {
                that.socket.emit('postMsg', msg); //把消息发送到服务器
                that._displayNewMsg('我', msg); //把自己的消息显示到自己的窗口中

                // sendBarrage(playList);//发送弹幕
                // setTimeout("barrageNum = 0",8000);

            };
        }, false);

        this.socket.on('newMsg', function(user, msg) {
            that._displayNewMsg(user, msg);
        });
    },

    //发送消息
    _displayNewMsg: function(user, msg, color) {
        var container = document.getElementById('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);
        msgToDisplay.style.color = color || '#444';
        // msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg;
        msgToDisplay.innerHTML = user + ' : ' + msg;
        $('#barrager').text(msg);
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    }
};
