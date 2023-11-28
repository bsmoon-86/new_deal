// express server open

const express = require('express')
const app = express()

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

app.get('/', function(req,res){
    res.render("index")
})

const http_server = app.listen(8080, function(){
    console.log('server start')
})



// websocket server open

const wsModule = require('ws')

const webSocketServer = new wsModule.Server(
    {
        server : http_server
    }
)

// websocket 이벤트 처리 
const sockets = [];
let i = 1
webSocketServer.on('connection', function(ws, request){
    // 연결되는 클라이언트의 ip를 변수에 대입
    const ip = request.headers['x-forwarded-for']  || request.connection.remoteAddress
    sockets.push(ws)
    ws["nickname"] = i;
    i += 1
    console.log('새로운 클라이언트 ip address', ip)
    // console.log(ws)
    //연결 여부를 체크
    if(ws.readyState === ws.OPEN){
        ws.send('웹소켓 서버와 연결되었습니다.')
    }

    // 클라이언트가 메시지를 보내는 경우
    ws.on('message', function(msg){
        // console.log(ip, ":", msg.toString('utf-8'))
        // ws.send(ip + ":" + msg.toString('utf-8'))
        sockets.forEach((aSocket) => aSocket.send(`${ws.nickname}: ${msg}`))
    })

    // 클라이언트와의 연결에서 에러가 발생하는 경우
    ws.on('error', function(err){
        console.log(err)
        ws.send('웹 소켓과의 연결에서 에러가 발생하였습니다.')
    })

    // 클라이언트와 연결이 종료되는 경우
    ws.on('close', function(){
        console.log(ip, "와의 연결이 종료되었습니다")
        ws.send('웹소켓과의 연결이 종료되었습니다.')
    })


})