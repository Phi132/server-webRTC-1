


const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');

app.set("view engine", "ejs");
app.set("views", "./server/views");
app.use(cors({
    origin: "*"

}));


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.header('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    // Pass to next layer of middleware
    next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var server = require("http").Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

server.listen(port)

let arrUser = [];

io.on("connection", socket => {
    //console.log("co nguoi ket noi voi id : ", socket.id);
    socket.on('NGUOI_DUNG_DANG_KY', (userName) => {
        const isExist = arrUser.some(element => element.ten === userName.ten)
        if (isExist) {
            return socket.emit("DA_CO_TEN_NGUOI_DUNG_NAY");
        }
        arrUser.push(userName);
        socket.peerId = userName.peerId;
        socket.emit('DANH_SACH_ONLINE', arrUser);
        socket.broadcast.emit('CO_NGUOI_MOI_DANG_NHAP', userName);
        socket.emit('TEN_NGUOI_DANG_NHAP', userName.ten);

    })
    socket.on('disconnect', () => {
        let index = arrUser.findIndex((userName) => {
            userName.peerId === socket.peerId
        })
        arrUser.splice(index, 1);
        io.emit('AI_DO_DA_NGAT_KET_NOI', socket.peerId);
    })

});





console.log(`port: http://localhost:${port}`);

app.get('/', (req, res) => {
    res.render('trangchu')
})
