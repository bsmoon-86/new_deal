const express = require('express')
const app = express()

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:false}))

// 배포한 컨트렉트의 정보를 로드
// 상대 경로
    // ./ : 현재 디렉토리
    // ../ : 상위 디렉토리로 이동
    // ./폴더명/ : 해당하는 하위 폴더로 이동
const contract_info = require("./build/contracts/user_info.json")
// console.log(contract_info.abi)
// console.log(contract_info.networks['1001'].address)

// klaytn의 컨트렉트 정보를 로드하기 위한 모듈을 로드
const Caver = require('caver-js')

// contract가 배포되어 있는 네트워크 주소 입력
const caver = new Caver('https://api.baobab.klaytn.net:8651')
// abi, address 값을 설정
const smartcontract = new caver.klay.Contract(
    contract_info.abi, 
    contract_info.networks['1001'].address
)
// 지갑 등록
const account = caver.klay.accounts.createWithAccountKey(
    "0x3778671B6beA5D1dcdd059F1e226B096c82c13a0", 
    "0xef0a0198393a7012063e4892fdeb4ead00a841beaa7c7188893833987d36d7c6"
)
caver.klay.accounts.wallet.add(account)

// localhost:3000 
app.get("/", function(req, res){
    res.render('index')
})

// localhost:3000/signup
app.get("/signup", function(req, res){
    res.render("signup")
})

// localhost:3000/signup2 [get]
app.get('/signup2', function(req, res){
    const _id = req.query.input_id
    const _pass = req.query.input_pass
    const _name = req.query.input_name
    const _phone = req.query.input_phone
    console.log(_id, _pass, _name, _phone)
    // 데이터들을 contract를 이용하여 블록에 저장
    // 유저를 등록하는 함수의 이름은 add_user(인자값이 4개)
    smartcontract
    .methods
    .add_user(_id, _pass, _name, _phone)
    .send({
        from : account.address, 
        gas : 2000000
    })    
    .then(function(result){
        res.redirect("/")
    })
})

app.post('/login', function(req, res){
    const _id = req.body.input_id
    const _pass = req.body.input_pass
    console.log(_id, _pass)
    // contract안에 있는 함수들 중 
    smartcontract.methods
    // view_info()함수를 호출
    .view_info(_id)
    .call()
    // 함수의 결과 값을 가지고 행동
    .then(function(result){
        // result라는 변수는 데이터의 형태? -> json
        // {'0' : password, '1' : name, '2' : phone}
        
        // 로그인이 성공하는 조건 ? 
        // 1. 유저가 입력한 id의 값이 contract의 mapping에 데이터가 존재
        // 2. 결과 값에 안에 있는 '0'키값의 벨류와 유저가 입력한 패스워드의 값이 같은 경우 
        if((result['0']) && (result['0'] == _pass)){
            res.render('main', {
                'name' : result['1']
            })
        }else{
            // 데이터가 존재하지 않을때
            res.redirect("/")
        }
    })
})


app.listen(3000, function(){
    console.log('Server Start')
})