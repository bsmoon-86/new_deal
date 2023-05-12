// express 로드 
const express = require('express')
const app = express()

// web3 로드
// web3 라이브러리 이더리움 네트워크에서 contract 호출하기위한 라이브러리
const Web3 = require('web3')
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

app.get('/signup', function(req, res){
    res.render('signup.ejs')
})

app.get('/signup2', function(req, res){
    const _id = req.query.id
    const _pass = req.query.pass
    const _name = req.query.name
    const _phone = req.query.phone
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
        res.send("")
    })
})



// 서버 시작
app.listen(3000, function(){
    console.log('Server Start')
})