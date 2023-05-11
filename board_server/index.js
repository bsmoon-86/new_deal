const express = require('express')
const app = express()
const session = require('express-session')
const mysql = require('mysql2')
require('dotenv').config()

app.use(express.urlencoded({extended:false}))

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

// 세션 설정
app.use(
    session({
        secret : process.env.session_key, 
        resave : false, 
        saveUninitialized : true, 
        cookie: {maxAge : 300000} // 세션 데이터를 300초 유지
    })
)


// sql 서버 정보를 입력
const connection = mysql.createConnection({
    host : process.env.host, 
    port : process.env.port, 
    user : process.env.user, 
    password : process.env.db_pass, 
    database : process.env.db
})

app.get('/', function(req, res){
    // 로그인 정보가 존재하면 main 주소로 이동
    if(req.session.login){
        res.redirect('/main')
    }
    // 로그인 정보가 존재하지 않으면 login 주소로 이동
    else{
        res.redirect('/login')
    }
})

app.get('/login', function(req, res){
    res.render('login.ejs')
})

app.post('/login2', function(req, res){
    const _id = req.body.input_id
    const _pass = req.body.input_pass
    console.log(_id, _pass)
    // 회원 정보를 확인
    connection.query(
        `select * from user_info where id = ? and pass = ?`, 
        [_id, _pass], 
        function(err, result){
            if(err){
                console.log('login :', err)
                res.send('login sql error')
            }else{
                // 정보가 존재하는가?
                if(result.length != 0){
                    req.session.login = result[0]    
                }
                res.redirect('/')
            }
        }
    )

})

app.get('/main', function(req, res){
    if(!req.session.login){
        res.redirect('/')
    }else{
        console.log(req.session.login)
        // mysql에 있는 board 테이블의 정보를 로드하여 
        // 유저에게 보내준다.
        connection.query(
            `select * from board`, 
            function(err, result){
                if(err){
                    console.log(err)
                    res.send('sql error')
                }else{
                    console.log(result)
                    res.render('main.ejs', {
                        'name' : req.session.login.name, 
                        'data' : result
                    })
                }
            }
        )
    }
})

const board = require('./routes/board.js')
// localhost:3000/board 주소로 요청 시
//  -> routes폴더에 있는 board.js 파일을 로드
app.use('/board', board)


app.listen(3000, function(){
    console.log('Server Start')
})