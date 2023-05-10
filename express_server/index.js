// express 프레임워크를 로드 
const express = require('express')
// express() 함수를 호출
const app = express()

// ejs파일들의 위치를 지정 
// __dirname : 현재 폴더 
app.set("views", __dirname+"/views")
// 보여주는 파일들은 ejs 엔진을 사용한다. 
app.set("view engine", 'ejs')


// app.use(express.json())
// post 형태의 데이터를 받기위해서 설정
// extended 옵션에 false : express에 있는 
// 기본 모듈(querystring)을 사용하겠다.
// true : qs 모듈을 사용한다.
// (별도의 설치가 필요한 부분 - 구버전)
app.use(express.urlencoded({extended:false}))


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
    const _id = req.query.id
    const _pass = req.query.pass
    // id가 test이고 password가 1234인 경우 로그인 성공
    // 아니면 로그인 실패 
    if (_id == 'test' && _pass == 1234){
        // 로그인 성공하였을 때
        // res.send('로그인 성공')
        res.render('index.ejs')
    }else{
        // 로그인이 실패하였을 때
        // res.send("로그인 실패")
        res.redirect("/")
    }
    // res.send('Second Page')
})

// localhost:3000/login post형식으로 만들어진 api
app.post('/login', (req, res) =>{
    // get으로 데이터를 보내는 형태에서 데이터가 query 에 존재
    // post 형태는 데이터가 req.body에 존재
    // console.log(req.body)
    // console.log(req.body)
    // res.send(req.body)

    // 서버에서 유저에게 데이터를 보내주는 부분
    res.render("third.ejs", {
        'input_id' : req.body.id
    })
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