// express 프레임워크를 로드 
const express = require('express')
// express() 함수를 호출
const app = express()

// ejs파일들의 위치를 지정 
// __dirname : 현재 폴더 
app.set("views", __dirname+"/views")
// 보여주는 파일들은 ejs 엔진을 사용한다. 
app.set("view engine", 'ejs')

// localhost:3000/ 요청이 들어왔을때 함수를 실행
// req : request 약자
// res : response 약자
app.get("/", function(req, res){
    // res.send("Hello World")
    // 기본 경로가 views 폴더로 지정하였기 때문에 
    // 파일의 이름만 적어주면 된다. 
    res.render("main.ejs")
})
// api : url 주소
// localhost:3000/second로 요청이 들어왔을때 
app.get('/second', function(req, res){
    console.log(req['query']['id'])
    console.log(req['query']['pass'])
    res.send('Second Page')
})

// port 번호 지정
const port = 3000
// web server 실행 
app.listen(port, function(){
    console.log('server start')
})



// 절대 경로
// 절대적인 주소
// www.google.com, c:/user
// 컴퓨터 환경이 변해도 같은 곳을 지정하는 경로

// 상대 경로
// 상대적인 주소
// ./ : 현재 경로
// ../ : 상위 폴더로 이동
// ./폴더명/ : 하위 폴더로 이동
// ./views/main.ejs = F:\new_deal\views\main.ejs