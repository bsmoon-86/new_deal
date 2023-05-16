// express 모듈을 로드 
const express = require('express')
// express()를 app이라는 변수 대입
const app = express()
// ejs 파일들의 기본 경로 설정
app.set('views', __dirname+"/views")
// view engine을 ejs를 사용한다. 
app.set('view engine', 'ejs')
// post방식으로 데이터가 들어올때 json형태로 데이터를 받는 세팅
app.use(express.urlencoded({extended:false}))

// mysql 모듈 로드 
const mysql = require('mysql2')
// mysql server 정보 입력
const connection = mysql.createConnection({
    host : '192.168.0.36', 
    port : 3306, 
    user : 'new_deal',
    password : '1234', 
    database : 'new_deal'
})


app.get("/", function(req, res){
    res.render('index.ejs')
})

app.get("/ajax", function(req, res){
    const _id = req.query._id
    console.log(_id)
    // mysql query문을 작성하여 id가 DB에 존재하는가?
    connection.query(
        `select
        * 
        from 
        user_info 
        where
        id = ?`, 
        [_id], 
        function(err, result){
            if(err){
                console.log(err)
            }else{
                console.log(result)
                // 데이터가 존재한다 = ID 사용이 불가능
                if (result.length > 0){
                    res.send('ID 사용이 불가능하다.')
                }
                // 데이터가 존재하지 않는다. = ID 사용이 가능
                else{
                    res.send('ID 사용이 가능하다.')
                }
            }
        }
    )
    // if(_id == 'test'){
    //     res.send('true')
    // }else{
    //     res.send('false')
    // }
})


// 서버 실행
app.listen(3000, function(){
    console.log('Server start')
})