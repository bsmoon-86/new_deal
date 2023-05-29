const express = require('express')
const app = express()

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:false}))

// dotenv 설정
require('dotenv').config()

// mysql 설정
const mysql = require('mysql2')
const connection = mysql.createConnection({
    host : process.env.host, 
    port: process.env.port, 
    user : process.env.user, 
    password : process.env.db_pass, 
    database : process.env.db
})

const contract_info = require("./build/contracts/survey.json")
// smartcontract를 로드 
const Caver = require('caver-js')
// 사용할 블록체인 네트워크 주소를 지정
const caver = new Caver('https://api.baobab.klaytn.net:8651') 
// 블록체인 네트워크에 있는 컨트렉트를 연결
const smartcontract = new caver.klay.Contract(
    contract_info.abi, 
    contract_info.networks['1001'].address
)
// 지갑의 정보를 등록
const account = caver.klay.accounts.createWithAccountKey(
    process.env.public_key, 
    process.env.private_key
)
caver.klay.accounts.wallet.add(account)

// 세션 설정
const session = require('express-session')
app.use(
    session(
        {
            secret : process.env.secret_key, 
            resave : false, 
            saveUninitialized : false, 
            cookie : {
                maxAge : 300000
            }
        }
    )
)

app.get("/", function(req, res){
    // 세션의 정보가 존재하면 main으로 이동
    if(req.session.login){
        res.redirect('/main')
    }else{
        // 세션의 정보가 존재하지 않으면 login이동
        res.redirect('/login')
    }
})

// login 페이지를 보여주는 api 
app.get('/login', function(req, res){
    res.render("login")
})

app.post('/login2', function(req, res){
    const _id = req.body._id
    const _pass = req.body._pass
    console.log(_id, _pass)

    // DB에 연결하여 유저가 입력한 데이터가 존재하는지 확인
    connection.query(
        `
            select 
            * 
            from 
            user_info 
            where 
            id = ? 
            and 
            pass = ?
        `, 
        [_id, _pass], 
        function(err, result){
            if(err){
                console.log('login :', err)
                res.send('login select error')
            }else{
                // 로그인 성공의 조건?
                // result가 존재하면
                if(result.length != 0){
                    req.session.login = result[0]
                }
                res.redirect('/')
            }
        }
    )
})

// main 페이지를 보여주는 api
app.get("/main", function(req, res){
    if(req.session.login){
        res.render("main")
    }else{
        res.redirect('/')
    }
})

const survey = require("./routes/survey")()
app.use('/survey', survey)





app.listen(3000, function(){
    console.log('Server start')
})