// express 로드
const express = require('express')
const app = express()

// mysql2 라이브러리 로드 
const mysql = require('mysql2')
// mysql 접속 정보 지정
const connection = mysql.createConnection({
    host : '192.168.0.36', // 'localhost'
    port : 3306, 
    user : 'new_deal',      // 'root'
    password : '1234',      // mysql password
    database : 'new_deal'   
})

// ejs 파일들의 기본 경로 설정
app.set('views', __dirname+"/views")
// ejs 엔진을 사용한다 세팅
app.set('view engine', 'ejs')

// post형태의 데이터를 받아오기 위한 세팅
app.use(express.urlencoded({extended:false}))

// sql CRUD
// C : Create
// R : Read
// U : Update
// D : Delete

// localhost:3000 요청시 api
app.get("/", function(req, res){
    res.render('login.ejs')
})

// localhost:3000/signin [post]형태의 주소를 생성
app.post('/signin', function(req, res){
    const _id = req.body.id
    const _pass = req.body.pass
    console.log(_id, _pass)
    connection.query(
        // select 조건 ? -> 유저가 입력한 
        // id, pass 값이 DB에 존재해야만 로그인 성공
        'select * from user_info where id = ? and pass = ?',  // select문을 사용
        [_id, _pass], 
        function(err, result){
            if(err){
                console.log('sql select error : ',err)
                res.send('sql error')
            }else{
                // 로그인이 성공하였을때
                if (result.length != 0){
                    // res.send('로그인 성공')
                    res.render('main.ejs')
                }else{
                    res.redirect("/")
                }
            }
        }
    )
    // res.send(_id)
})

// localhost:3000/signup [get] 주소를 생성
app.get('/signup', function(req, res){
    res.render('signup.ejs')
})

// localhost:3000/signup2 [post] 주소를 생성
app.post("/signup2", function(req, res){
    const _id = req.body.id
    const _pass = req.body.pass
    const _name = req.body.name
    const _phone = req.body.phone
    console.log(_id, _pass, _name, _phone)
    // 받아온 데이터들을 sql server에 insert
    connection.query(
        'insert into user_info values (?, ?, ?, ?)', 
        [_id, _pass, _name, _phone], 
        function(err, result){
            if(err){
                // insert 도중에 에러가 발생하는 경우
                console.log('sql insert error = ',err)
            }else{
                // insert가 성공하였을 때 -> 회원가입 완료
                console.log(result)
                res.redirect("/")
            }
        }
    )

    // res.send(req.body)
})


// server start 
app.listen(3000, function(){
    console.log("Server Start")
})