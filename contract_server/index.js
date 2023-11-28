// express 로드 
const express = require('express')
const app = express()

// web3 로드
// web3 라이브러리 이더리움 네트워크에서 contract 호출하기위한 라이브러리
const {Web3} = require('web3')
// 컨트렉트의 정보를 로드 
const contract_info = require('./build/contracts/user_info.json')

// 컨트렉트가 배포되어있는 네트워크 주소 입력
const web3 = new Web3(new Web3.providers.HttpProvider(
    'http://127.0.0.1:7545'))
console.log(contract_info['networks'][5777]['address'])
// 배포한 컨트렉트의 주소와 abi 값을 등록
const smartcontract = new web3.eth.Contract(
    contract_info['abi'], 
    contract_info['networks'][5777]['address']
)

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:false}))

// dotenv 설정
require('dotenv').config()

// session 설정
const session = require('express-session')
app.use(
    session({
        secret : process.env.session_key, 
        resave : false, 
        saveUninitialized : true, 
        cookie : {maxAge : 60000}
    })
)

// ganache에 있는 주소값들을 로드 
let address
web3.eth.getAccounts(function(err, ass){
    if(err){
        console.log(err)
    }else{
        console.log(ass)
        address = ass
    }
})

// localhost:3000/ [get] 주소 생성
app.get("/", function(req, res){
    // session에 로그인 정보가 존재하지 않을 때
    // if (조건식) -> 조건식의 데이터의 형태는 : bool
    // if 뒤의 조건식에 bool형태가 아닌 데이터가 들어오면 
    // if 가 데이터를 강제로 bool형태로 변경
    // 데이터가 값이 있으면 true, 값이 존재하지 않으면 false
    // !는 부정 true -> false, false -> true
    // console.log(!req.session.login)
    if (!req.session.login){
        res.render('index.ejs')     
    }else{
        console.log(req.session.login)
        res.render('main.ejs', {
            'name' : req.session.login['1']
        })
    }
    // views폴더 안에 있는 index.ejs 파일 유저에게 보내준다
})

app.get('/signup', function(req, res){
    res.render('signup.ejs')
})

app.get('/signup2', function(req, res){
    const _id = req.query.input_id
    const _pass = req.query.input_pass
    const _name = req.query.input_name
    const _phone = req.query.input_phone
    console.log(_id, _pass, _name, _phone)


    // 컨트렉트 안에 있는 add_user 함수를 호출
    smartcontract.methods
    .add_user(_id, _pass, _name, _phone)
    .send(
        {
            gas : 200000, 
            from : address[0]
        }
    ).then(function(receipt){
        console.log(receipt)
        res.redirect("/")
    })
})

// 로그인을 구현
// localhost:3000/login [post] 요청 시
app.post("/login", function(req, res){
    // post 형태에서 유저가 보낸 데이터의 위치는? request.body
    console.log(req.body)
    const _id = req.body.input_id
    const _pass = req.body.input_pass
    console.log(_id, _pass)

    // 입력받은 ID 값을 기준으로 컨트렉트의 view 함수를 호출
    smartcontract.methods
    .view_info(_id)     // view_info()함수는 트랜젝션 발생하지 않는다
    .call()             // view 함수에서는 send()가 아니라 call()을 사용
    .then(function(result){
        // result라는 변수에는 블록에 있는 데이터가 대입
        // {'0' : password, '1' : name, '2' : phone}
        console.log(result)
        // 입력받은 password와 block에 있는 password 값이 같은 경우 
        // 로그인 성공
        if (_pass == result[0]){
            // 로그인 성공 메시지를 출력
            // json 형태의 데이터에 key:value를 추가하려면?
            // req.session -> request 메시지 안에 session이라는 키 값의 value
            // value의 형태는 json
            // json 새로운 키 값 'login'에 value를 result를 대입한다.
            // result 데이터형태 -> json 
            // 입력받은 아이디값을 추가 key는 id value는 입력받은 아이디값
            result.id = _id
            req.session['login'] = result
        }
        res.redirect('/')
    })
})


// 서버 시작
app.listen(3000, function(){
    console.log('Server Start')
})