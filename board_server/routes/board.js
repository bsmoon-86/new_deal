const express = require('express')
const router = express.Router()
const mysql  = require('mysql2')

const connection = mysql.createConnection({
    host : process.env.host, 
    port : process.env.port, 
    user : process.env.user, 
    password : process.env.db_pass, 
    database : process.env.db
})

// 현재 파일의 기본 주소는 
// localhost:3000/board


// localhost:3000/board 로 요청 시
router.get('/', function(req, res){
    res.render('add_board.ejs')
})

// localhost:3000/board/add 주소로 요청 시
router.post('/add', function(req, res){
    const _title = req.body.input_title
    const _content = req.body.input_content
    console.log(_title, _content)
    const _writer = req.session.login.name
    // DB에 추가
    connection.query(
        `insert into board(title, content, writer) 
        values (?, ?, ?)`, 
        [_title, _content, _writer], 
        function(err, result){
            if(err){
                console.log("insert error :", err)
                res.send('sql error')
            }else{
                res.redirect('/')
            }
        }
    )
})


module.exports = router