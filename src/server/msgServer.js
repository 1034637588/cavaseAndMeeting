var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
app.get('/', (req, res) => {
    res.end("666")
});

//服务器监听
io.on('connection', (socket) => { //没个用户就是一个新的连接
    let code = '';//设置会议的id
    let joinID = ''; //记录参加会议的id
    console.log('a user connected');
    //建立会议群聊
    socket.on('makeMeeting', (data) => {
        code = data.code; //房间号
        let name = data.name;
        let myRoom = io.sockets.adapter.rooms[code];
        if (!myRoom) {
            socket.join(code);//加入房间
            socket.emit("bossjoined", code, socket.id);
        } else {
            socket.emit("errorMake", code, socket.id);
        }
    });
    //加入会议群聊
    socket.on('joinMeeting', (data) => { //加入会议
        console.log(socket.id, "----------joinMeeting")
        //判断是否有这个房间
        joinID = data.code;
        let name = data.name;
        let myRoom = io.sockets.adapter.rooms[joinID];//
        
        if (!myRoom) {
            socket.emit("noRoom", joinID, socket.id);
        } else {
            let nums = myRoom.length; //房间人数
            socket.join(joinID);//加入房间
            socket.emit("userjoined", joinID, socket.id);
            socket.to(joinID).emit(`otherjoined`, joinID, name, socket.id,nums); //给房间里广播
        }
    });
    //监听群聊信息
    socket.on(`message`, (data, room, name, socketId) => { //广播群聊
        console.log("getMsg-------", data.type, room);
        socket.to(room).emit(`message`, room, { msg: data, name: name, socketId }); //给房间里广播
    });
    //监听canvas
    socket.on('canvas', (data, room) => {
        console.log(data, room)
        socket.to(room).emit(`canvas`, data, room); //给房间里广播
    });
    //监听离开房间
    socket.on("leave", (data) => {
        let { code, name } = data;
        let myRoom = io.sockets.adapter.rooms[code];
        socket.leave(code, () => {
            socket.emit("leaved", code);
            socket.to(code).emit(`otherleaved`, code, name, socket.id); //给房间里广播
        });
    });
    socket.on("bossleave", (data) => {
        let { code, name } = data;
        let myRoom = io.sockets.adapter.rooms[code];
        socket.to(code).emit(`bossleaved`, code, name); //给房间里广播
        socket.leave(code, () => {
            console.log("----------bossleave")
            delete io.sockets.adapter.rooms[code];
        });
    });
});



http.listen(3000, () => {
    console.log('listening on *:3000');
});

